import { useState, useEffect } from "react";
import { X, CheckCircle, Lock, ChevronLeft, ChevronRight, BookOpen, Brain, Lightbulb, Code2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { generateModuleContent, type AIModuleContent } from "@/lib/openai";
import { getModuleData } from "./moduleData";
import { sendModuleCompleteEmail, sendCourseCompleteEmail } from "@/lib/emailService";
import { awardBadge, addPoints } from "@/lib/achievements";
import { generateCertificatePDF } from "@/lib/certificate";

interface Props {
  module: any;
  courseTitle: string;
  userId: string;
  courseId: string;
  onDone: () => void;
  onClose: () => void;
}

const ModuleViewer = ({ module: mod, courseTitle, userId, courseId, onDone, onClose }: Props) => {
  const { toast } = useToast();
  const [content, setContent] = useState<AIModuleContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [tab, setTab] = useState<"notes" | "quiz">("notes");
  const [noteIndex, setNoteIndex] = useState(0);
  const [quizCurrent, setQuizCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [marking, setMarking] = useState(false);

  // Load AI content on mount
  useEffect(() => {
    const load = async () => {
      setLoadingContent(true);
      try {
        const aiContent = await generateModuleContent(mod.title, courseTitle);
        setContent(aiContent);
      } catch (e) {
        // Fallback to static content
        const fallback = getModuleData(mod.title);
        setContent(fallback as AIModuleContent);
      } finally {
        setLoadingContent(false);
      }
    };
    load();
  }, [mod.title, courseTitle]);

  const notes = content?.notes || [];
  const quiz = content?.quiz || [];
  const quizScore = quizDone ? answers.filter((a, i) => a === quiz[i]?.answer).length : 0;
  const quizPassed = quizDone && quiz.length > 0 && quizScore >= Math.ceil(quiz.length * 0.75);

  const handleQuizNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (quizCurrent < quiz.length - 1) {
      setAnswers(newAnswers);
      setQuizCurrent(quizCurrent + 1);
      setSelected(null);
    } else {
      setAnswers(newAnswers);
      setQuizDone(true);
    }
  };

  const handleMarkDone = async () => {
    setMarking(true);
    const { error: upsertError } = await supabase.from("module_progress").upsert(
      { user_id: userId, module_id: mod.id, status: "done" },
      { onConflict: "user_id,module_id" }
    );
    if (upsertError) {
      await supabase.from("module_progress")
        .update({ status: "done" })
        .eq("user_id", userId).eq("module_id", mod.id);
    }
    await new Promise(r => setTimeout(r, 300));
    const { data: allMods } = await supabase.from("course_modules").select("id").eq("course_id", courseId);
    const { data: doneMods } = await supabase.from("module_progress")
      .select("id").eq("user_id", userId).eq("status", "done")
      .in("module_id", (allMods || []).map((m: any) => m.id));
    const total = allMods?.length || 1;
    const done = doneMods?.length || 0;
    const progress = Math.round((done / total) * 100);
    await supabase.from("enrollments")
      .update({ progress, last_lesson: mod.title })
      .eq("user_id", userId).eq("course_id", courseId);

    // Get user email
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "";
    const userName = user?.user_metadata?.full_name || "Student";

    // Send module completion email
    await sendModuleCompleteEmail(userEmail, userName, mod.title, courseTitle, progress);

    // If 100% — issue certificate and award badges
    if (progress === 100) {
      const { data: existing } = await supabase.from("certificates")
        .select("id").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
      if (!existing) {
        await supabase.from("certificates").insert({ user_id: userId, course_id: courseId });
      }
      // Award course_complete badge and points
      await awardBadge(userId, "course_complete", toast);
      await addPoints(userId, 500);

      // Generate PDF certificate and send via email
      try {
        const { base64 } = await generateCertificatePDF(userName, courseTitle, "📚", new Date().toISOString());
        await sendCourseCompleteEmail(userEmail, userName, courseTitle, "📚", base64);
      } catch (emailErr) {
        console.warn("Email send failed:", emailErr);
      }
      toast({ title: "🎉 Course Complete!", description: "Certificate issued & badge earned! Check Achievements." });
    } else {
      await addPoints(userId, 50);
      toast({ title: "✅ Module complete!", description: `Progress: ${progress}% — Check your email!` });
    }

    setMarking(false);
    onDone();
    onClose();
  };

  const currentNote = notes[noteIndex];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">{courseTitle}</p>
              <p className="font-semibold text-sm leading-tight">{mod.title}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mod.status === "done" && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" /> Completed
            </Badge>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-border bg-card shrink-0 px-6">
        <button onClick={() => setTab("notes")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            tab === "notes" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}>
          <BookOpen className="w-4 h-4" /> Study Notes
        </button>
        <button onClick={() => setTab("quiz")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            tab === "quiz" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}>
          <Brain className="w-4 h-4" /> Module Quiz
          {quizDone && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${quizPassed ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-500"}`}>
              {quizScore}/{quiz.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Main content ── */}
      {loadingContent ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <p className="font-semibold">Generating AI content...</p>
            <p className="text-sm text-muted-foreground">Creating detailed notes and quiz for {mod.title}</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── NOTES TAB ── */}
          {tab === "notes" && notes.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-8 py-8">
                
                {/* Module Header */}
                <div className="mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{courseTitle}</p>
                      <h1 className="text-3xl font-bold">{mod.title}</h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {notes.length} Sections
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4" />
                      {quiz.length} Quiz Questions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <List className="w-4 h-4" />
                      {notes.reduce((sum, n) => sum + (n.keyPoints?.length || 0), 0)} Key Points
                    </span>
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="mb-10 p-6 rounded-xl bg-muted/30 border border-border">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    Table of Contents
                  </h2>
                  <nav className="space-y-2">
                    {notes.map((note, i) => (
                      <a
                        key={i}
                        href={`#section-${i}`}
                        className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm group"
                      >
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="group-hover:text-primary transition-colors">
                          {note.heading}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>

                {/* All Sections - Continuous Scroll */}
                <div className="space-y-12">
                  {notes.map((note, i) => (
                    <section
                      key={i}
                      id={`section-${i}`}
                      className="scroll-mt-8 space-y-6"
                    >
                      {/* Section Header */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {i + 1}
                          </span>
                          <h2 className="text-2xl font-bold">{note.heading}</h2>
                        </div>
                        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
                      </div>

                      {/* Body Content */}
                      <div className="prose prose-base max-w-none">
                        <div className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {note.body}
                        </div>
                      </div>

                      {/* Key Points */}
                      {note.keyPoints && note.keyPoints.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <List className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg">Key Takeaways</h3>
                          </div>
                          <div className="space-y-3">
                            {note.keyPoints.map((pt, j) => (
                              <div
                                key={j}
                                className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                              >
                                <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                                  {j + 1}
                                </span>
                                <span className="text-sm text-foreground/90 leading-relaxed flex-1">
                                  {pt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code Block */}
                      {note.code && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Code2 className="w-4 h-4 text-accent" />
                            </div>
                            <h3 className="font-semibold text-lg">Code Example</h3>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                            <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e2e] border-b border-white/10">
                              <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                              </div>
                              <span className="text-xs text-white/40 font-mono">example.code</span>
                            </div>
                            <pre className="bg-[#1e1e2e] p-6 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre">
                              {note.code}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Pro Tip */}
                      {note.tip && (
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                              💡 Pro Tip
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                              {note.tip}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Section Divider */}
                      {i < notes.length - 1 && (
                        <div className="pt-8">
                          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>
                      )}
                    </section>
                  ))}
                </div>

                {/* End of Notes - CTA */}
                <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-primary/20 text-center space-y-4">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-xl font-bold">Ready to Test Your Knowledge?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    You've completed all {notes.length} sections. Take the quiz to assess your understanding and mark this module as complete.
                  </p>
                  <Button
                    size="lg"
                    className="gradient-primary text-white border-0 font-semibold gap-2 h-12 px-8"
                    onClick={() => setTab("quiz")}
                  >
                    <Brain className="w-5 h-5" />
                    Take the Quiz
                  </Button>
                </div>

                {/* Scroll to Top Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ↑ Back to Top
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── QUIZ TAB ── */}
          {tab === "quiz" && (
            <div className="flex-1 overflow-y-auto flex items-start justify-center p-8">
              <div className="w-full max-w-2xl space-y-6">

                {!quizDone ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Question {quizCurrent + 1} of {quiz.length}</span>
                        <span>{Math.round((quizCurrent / quiz.length) * 100)}% complete</span>
                      </div>
                      <Progress value={(quizCurrent / quiz.length) * 100} className="h-2" />
                    </div>

                    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">Q{quizCurrent + 1}</span>
                        <p className="text-lg font-semibold leading-snug pt-0.5">{quiz[quizCurrent]?.q}</p>
                      </div>

                      <div className="space-y-3">
                        {quiz[quizCurrent]?.options.map((opt, i) => (
                          <button key={i} onClick={() => setSelected(i)}
                            className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all ${
                              selected === i
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border hover:border-primary/40 hover:bg-muted/40"
                            }`}>
                            <span className="font-bold mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>

                      <Button className="w-full h-12 gradient-primary text-white border-0 font-semibold text-base"
                        onClick={handleQuizNext} disabled={selected === null}>
                        {quizCurrent < quiz.length - 1 ? "Next Question →" : "Submit Quiz"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    {/* Score card */}
                    <div className={`p-8 rounded-2xl text-center space-y-3 border-2 ${quizPassed ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                      <div className="text-6xl">{quizPassed ? "🎉" : "😔"}</div>
                      <h2 className="text-2xl font-bold">{quizPassed ? "Quiz Passed!" : "Not quite there"}</h2>
                      <p className="text-muted-foreground">
                        You scored <span className="font-bold text-foreground">{quizScore}/{quiz.length}</span> ({Math.round((quizScore / quiz.length) * 100)}%)
                      </p>
                      <p className="text-xs text-muted-foreground">Passing score: 75%</p>
                    </div>

                    {/* Answer review */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Answer Review</h3>
                      {quiz.map((q, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${answers[i] === q.answer ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                          <div className="flex items-start gap-2">
                            <span className={`text-lg shrink-0 ${answers[i] === q.answer ? "text-green-500" : "text-red-500"}`}>
                              {answers[i] === q.answer ? "✓" : "✗"}
                            </span>
                            <div className="space-y-1 flex-1">
                              <p className="font-medium text-sm">{q.q}</p>
                              {answers[i] !== q.answer && (
                                <p className="text-xs text-red-500">Your answer: {q.options[answers[i]]}</p>
                              )}
                              <p className="text-xs text-green-600">Correct: {q.options[q.answer]}</p>
                              {(q as any).explanation && (
                                <p className="text-xs text-muted-foreground mt-1 italic">{(q as any).explanation}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {quizPassed ? (
                      <Button className="w-full h-12 gradient-primary text-white border-0 font-semibold text-base gap-2"
                        onClick={handleMarkDone} disabled={marking || mod.status === "done"}>
                        {marking
                          ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          : <><CheckCircle className="w-5 h-5" /> Mark Module as Done</>}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full h-12"
                          onClick={() => { setQuizCurrent(0); setSelected(null); setAnswers([]); setQuizDone(false); }}>
                          Retry Quiz
                        </Button>
                        <button onClick={() => { setTab("notes"); setNoteIndex(0); }}
                          className="w-full text-sm text-primary hover:underline text-center">
                          Review notes again →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModuleViewer;
