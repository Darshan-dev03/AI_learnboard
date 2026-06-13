import { useState, useEffect } from "react";
import { Timer, CheckCircle, XCircle, Brain, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { generateWeeklyQuiz, type WeeklyQuizQuestion } from "@/lib/groq";
import { awardBadge, addPoints } from "@/lib/achievements";

const awardAchievement = async (userId: string, criteria: string, toast: any) => {
  await awardBadge(userId, criteria, toast);
};

type Phase = "intro" | "quiz" | "result";

const WeeklyQuiz = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<WeeklyQuizQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || phase !== "quiz" || selected !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-select a random answer or mark as skipped
          setSelected(-1); // -1 indicates time ran out
          setShowExplanation(true);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, phase, selected]);

  // Fetch topics from user's enrolled courses and modules
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        // Get user's enrolled courses
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("course_id, courses(title)")
          .eq("user_id", user.id);

        if (!enrollments || enrollments.length === 0) {
          // If no enrollments, show default topics
          setTopics([
            "JavaScript Fundamentals",
            "React Hooks & Components",
            "HTML & CSS Basics",
            "Data Structures & Algorithms",
            "Node.js & Express",
            "Python Programming",
          ]);
          setTopic("JavaScript Fundamentals");
          setLoadingTopics(false);
          return;
        }

        // Get modules for enrolled courses
        const courseIds = enrollments.map(e => e.course_id);
        const { data: modules } = await supabase
          .from("course_modules")
          .select("title, course_id, courses(title)")
          .in("course_id", courseIds)
          .order("order_index");

        // Create organized topic list
        const topicList: string[] = [];
        
        // Group by course
        enrollments.forEach(enrollment => {
          const courseName = enrollment.courses?.title;
          if (!courseName) return;
          
          // Add course as main topic
          topicList.push(courseName);
          
          // Add modules for this course
          const courseModules = modules?.filter(m => m.course_id === enrollment.course_id) || [];
          courseModules.forEach(module => {
            // Clean up module title - remove "Module X –" prefix for cleaner display
            let cleanTitle = module.title.replace(/^Module\s+\d+\s*[–-]\s*/i, '');
            topicList.push(`  ${cleanTitle}`); // Indent with spaces
          });
        });

        if (topicList.length > 0) {
          setTopics(topicList);
          setTopic(topicList[0]);
        } else {
          // Fallback to default topics
          setTopics([
            "JavaScript Fundamentals",
            "React Hooks & Components",
            "HTML & CSS Basics",
          ]);
          setTopic("JavaScript Fundamentals");
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        // Fallback to default topics on error
        setTopics([
          "JavaScript Fundamentals",
          "React Hooks & Components",
          "HTML & CSS Basics",
        ]);
        setTopic("JavaScript Fundamentals");
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [user.id]);

  const startQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const qs = await generateWeeklyQuiz(topic, 5);
      setQuestions(qs);
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(20);
      setTimerActive(true); // Start the timer
      setPhase("quiz");
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate quiz. Check your API key.", variant: "destructive" });
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExplanation(true);
    setTimerActive(false); // Stop the timer when answer is selected
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      const score = newAnswers.filter((a, i) => a === questions[i]?.correct_index).length;
      const pct = Math.round((score / questions.length) * 100);
      // Save attempt
      await supabase.from("quiz_attempts").insert({
        user_id: user.id, quiz_id: null,
        score, total: questions.length, answers: newAnswers,
      });
      // Award points and badges based on score
      await addPoints(user.id, score * 10);
      if (pct === 100) await awardAchievement(user.id, "quiz_perfect", toast);
      if (pct >= 80) await awardAchievement(user.id, "quick_learner", toast);
      setTimerActive(false); // Stop timer at end
      setPhase("result");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(20);
      setTimerActive(true); // Restart timer for next question
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct_index).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ── INTRO ──
  if (phase === "intro") return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Weekly AI Quiz</h1>
        <p className="text-muted-foreground mt-1">AI-generated questions based on your enrolled courses</p>
      </div>

      {loadingTopics ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center space-y-3">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading your course topics...</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Choose Your Topic
            </CardTitle>
            <p className="text-xs text-muted-foreground font-normal">
              Topics from your enrolled courses and modules
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topics.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No courses enrolled yet. Enroll in courses to get personalized quiz topics!
                </p>
                <Button variant="outline" onClick={() => window.location.href = "/dashboard/courses"}>
                  Browse Courses
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {topics.map((t, index) => {
                    const isMainTopic = !t.startsWith('  '); // Main topics don't have indent
                    const displayText = t.trim();
                    
                    return (
                      <button
                        key={`${t}-${index}`}
                        onClick={() => setTopic(displayText)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                          topic === displayText
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 hover:border-primary/40 hover:bg-muted/40"
                        } ${
                          isMainTopic
                            ? "font-semibold"
                            : "ml-4 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isMainTopic ? (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 shrink-0" />
                            <span>{displayText}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">└─</span>
                            <span>{displayText}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl text-sm text-muted-foreground">
                  <Brain className="w-4 h-4 text-primary shrink-0" />
                  <span>5 AI-generated questions · 20 seconds each · Earn badges for high scores</span>
                </div>

                <Button className="w-full h-11 gradient-primary text-white border-0 font-semibold gap-2"
                  onClick={startQuiz} disabled={loadingQuiz || !topic}>
                  {loadingQuiz ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Quiz...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate & Start Quiz</>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ── RESULT ──
  if (phase === "result") return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Quiz Results</h1>

      <Card className={`border-2 ${pct >= 80 ? "border-green-500/40 bg-green-500/5" : pct >= 60 ? "border-yellow-500/40 bg-yellow-500/5" : "border-red-500/40 bg-red-500/5"}`}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-6xl">{pct === 100 ? "🏆" : pct >= 80 ? "🥇" : pct >= 60 ? "👍" : "📚"}</div>
          <div>
            <p className="text-4xl font-bold gradient-text">{score}/{questions.length}</p>
            <p className="text-muted-foreground mt-1">Score: {pct}%</p>
          </div>
          <Progress value={pct} className={`h-3 ${pct >= 80 ? "[&>div]:bg-green-500" : pct >= 60 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"}`} />
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge className={`border text-sm px-3 py-1 ${pct >= 80 ? "bg-green-500/20 text-green-500 border-green-500/30" : pct >= 60 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" : "bg-red-500/20 text-red-500 border-red-500/30"}`}>
              {pct === 100 ? "🏆 Perfect Score!" : pct >= 80 ? "🥇 Excellent!" : pct >= 60 ? "👍 Good Job!" : "📚 Keep Practicing!"}
            </Badge>
            {pct >= 80 && <Badge className="bg-primary/20 text-primary border-primary/30 border text-sm px-3 py-1">🎖️ Badge Earned!</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Answer Review</h2>
        {questions.map((q, i) => {
          const correct = answers[i] === q.correct_index;
          return (
            <Card key={i} className={`border ${correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start gap-2">
                  {correct ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
                {!correct && <p className="text-xs text-red-400 pl-6">Your answer: {q.options[answers[i] as number]}</p>}
                <p className="text-xs text-green-500 pl-6">✅ Correct: {q.options[q.correct_index]}</p>
                <p className="text-xs text-muted-foreground pl-6">💡 {q.explanation}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button className="gradient-primary text-white border-0 gap-2" onClick={() => setPhase("intro")}>
          <RefreshCw className="w-4 h-4" /> New Quiz
        </Button>
        <Button variant="outline" onClick={startQuiz} disabled={loadingQuiz}>
          {loadingQuiz ? "Generating..." : "Retry Same Topic"}
        </Button>
      </div>
    </div>
  );

  // ── QUIZ ──
  const q = questions[current];
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Weekly Quiz</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{topic}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${timeLeft <= 5 ? "border-red-500/50 text-red-400 bg-red-500/10" : "border-primary/30 text-primary bg-primary/10"}`}>
          <Timer className="w-4 h-4" /> {timeLeft}s
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</p>

      <Card className="border-border/50">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">Q{current + 1}</span>
            <p className="text-base font-semibold leading-snug pt-1">{q.question}</p>
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              let cls = "border-border/50 hover:border-primary/50 hover:bg-primary/5";
              if (selected !== null) {
                if (i === q.correct_index) cls = "border-green-500 bg-green-500/10 text-green-400";
                else if (i === selected) cls = "border-red-500 bg-red-500/10 text-red-400";
                else cls = "border-border/30 opacity-40";
              }
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${cls}`}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`border rounded-xl p-4 text-sm space-y-1 ${
              selected === -1 
                ? "bg-red-500/10 border-red-500/20" 
                : "bg-primary/10 border-primary/20"
            }`}>
              {selected === -1 ? (
                <>
                  <p className="text-red-500 font-semibold">⏰ Time's Up!</p>
                  <p className="text-muted-foreground">The correct answer was: {q.options[q.correct_index]}</p>
                  <p className="text-muted-foreground">{q.explanation}</p>
                </>
              ) : (
                <>
                  <p className="text-primary font-semibold">💡 Explanation</p>
                  <p className="text-muted-foreground">{q.explanation}</p>
                </>
              )}
            </div>
          )}

          {selected !== null && (
            <Button className="w-full h-11 gradient-primary text-white border-0 font-semibold" onClick={handleNext}>
              {current + 1 === questions.length ? "See Results 🎯" : "Next Question →"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyQuiz;
