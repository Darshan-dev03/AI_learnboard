import { useState, useEffect } from "react";
import { Timer, CheckCircle, XCircle, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuiz } from "@/lib/hooks/useDashboard";
import { supabase } from "@/lib/supabase";

type Phase = "intro" | "quiz" | "result";

const WeeklyQuiz = ({ user }: { user: any }) => {
  const { quiz, questions, loading } = useQuiz();
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (timeLeft === 0) { handleNext(null); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExplanation(true);
  };

  const handleNext = (sel: number | null) => {
    const ans = sel ?? selected;
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      const score = newAnswers.filter((a, i) => a === questions[i]?.correct_index).length;
      supabase.from("quiz_attempts").insert({
        user_id: user.id, quiz_id: quiz?.id,
        score, total: questions.length, answers: newAnswers,
      });
      setPhase("result");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(quiz?.time_per_question || 15);
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct_index).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (phase === "intro") return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Weekly AI Quiz</h1>
        <p className="text-muted-foreground mt-1">Test your knowledge with AI-generated questions</p>
      </div>
      <Card className="border-primary/30 bg-primary/5 max-w-lg">
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> {quiz?.title || "This Week's Quiz"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Topic</span><span className="font-medium">{quiz?.topic || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Questions</span><span className="font-medium">{questions.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time per question</span><span className="font-medium">{quiz?.time_per_question || 15} seconds</span></div>
          </div>
          <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={() => setPhase("quiz")} disabled={questions.length === 0}>
            {questions.length === 0 ? "No quiz available" : "Start Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (phase === "result") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold">Quiz Results</h1>
        <Card className="border-border/50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-6xl">{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}</div>
            <div>
              <p className="text-3xl font-bold gradient-text">{score} / {questions.length}</p>
              <p className="text-muted-foreground">Score: {pct}%</p>
            </div>
            <Progress value={pct} className="h-3" />
            <Badge className={`${pct >= 80 ? "bg-green-500/20 text-green-400 border-green-500/30" : pct >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"} border`}>
              {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : "Keep Practicing!"}
            </Badge>
          </CardContent>
        </Card>
        <div className="space-y-3">
          <h2 className="font-semibold">Review Answers</h2>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct_index;
            const opts = Array.isArray(q.options) ? q.options : JSON.parse(q.options);
            return (
              <Card key={i} className={`border ${correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {correct ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{q.question}</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">✅ {opts[q.correct_index]}</p>
                  <p className="text-xs text-primary pl-6">💡 {q.explanation}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => { setPhase("intro"); setCurrent(0); setAnswers([]); setSelected(null); setTimeLeft(quiz?.time_per_question || 15); }}>
          Retake Quiz
        </Button>
      </div>
    );
  }

  const q = questions[current];
  const opts = Array.isArray(q.options) ? q.options : JSON.parse(q.options);
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Quiz</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${timeLeft <= 5 ? "border-red-500/50 text-red-400 bg-red-500/10" : "border-primary/30 text-primary bg-primary/10"}`}>
          <Timer className="w-4 h-4" /> {timeLeft}s
        </div>
      </div>
      <div className="flex items-center gap-2">
        {questions.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-muted"}`} />)}
      </div>
      <p className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</p>
      <Card className="border-border/50">
        <CardContent className="p-6 space-y-5">
          <p className="text-lg font-semibold">{q.question}</p>
          <div className="space-y-3">
            {opts.map((opt: string, i: number) => {
              let style = "border-border/50 hover:border-primary/50 hover:bg-primary/5";
              if (selected !== null) {
                if (i === q.correct_index) style = "border-green-500 bg-green-500/10 text-green-400";
                else if (i === selected) style = "border-red-500 bg-red-500/10 text-red-400";
                else style = "border-border/30 opacity-50";
              }
              return (
                <button key={i} onClick={() => handleSelect(i)} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${style}`}>
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              );
            })}
          </div>
          {showExplanation && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="text-primary font-medium mb-1">💡 Explanation</p>
              <p className="text-muted-foreground">{q.explanation}</p>
            </div>
          )}
          {selected !== null && (
            <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={() => handleNext(selected)}>
              {current + 1 === questions.length ? "See Results" : "Next Question →"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyQuiz;
