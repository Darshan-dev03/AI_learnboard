import { useState } from "react";
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronUp, Award, ShoppingBag, X, Brain, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import ModuleViewer from "./ModuleViewer";
import { getModuleData } from "./moduleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useEnrollments, useModuleProgress, useCertificates } from "@/lib/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";
import { downloadCertificatePDF } from "@/lib/certificate";

const statusIcon = (status: string) => {
  if (status === "done") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "active") return <PlayCircle className="w-4 h-4 text-primary" />;
  return <Lock className="w-4 h-4 text-muted-foreground" />;
};

// Generate a simple HTML certificate and trigger download
const downloadCertificate = (userName: string, courseTitle: string, courseEmoji: string, issuedAt: string) => {
  const date = new Date(issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const certId = "ALB-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Certificate of Completion – ${courseTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1122px;
      height: 794px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif;
    }

    .page {
      width: 1122px;
      height: 794px;
      position: relative;
      background: #fff;
      overflow: hidden;
    }

    /* Outer gold border */
    .border-outer {
      position: absolute;
      inset: 18px;
      border: 3px solid #c9a84c;
    }

    /* Inner gold border */
    .border-inner {
      position: absolute;
      inset: 26px;
      border: 1px solid #e8d48b;
    }

    /* Corner ornaments */
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      font-size: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c9a84c;
      font-family: serif;
    }
    .corner.tl { top: 10px; left: 10px; }
    .corner.tr { top: 10px; right: 10px; transform: scaleX(-1); }
    .corner.bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
    .corner.br { bottom: 10px; right: 10px; transform: scale(-1); }

    /* Background watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 180px;
      opacity: 0.04;
      color: #6c63ff;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      letter-spacing: -4px;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }

    /* Left accent bar */
    .accent-bar {
      position: absolute;
      left: 40px;
      top: 40px;
      bottom: 40px;
      width: 6px;
      background: linear-gradient(180deg, #6c63ff 0%, #a78bfa 50%, #c9a84c 100%);
      border-radius: 3px;
    }

    /* Main content */
    .content {
      position: absolute;
      inset: 40px 50px 40px 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }

    .logo-circle {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6c63ff, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }

    .brand-name {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #6c63ff;
      font-weight: 600;
    }

    .divider-gold {
      width: 200px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #c9a84c, transparent);
      margin: 10px auto;
    }

    .title {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: 2px;
      line-height: 1.1;
      margin-bottom: 4px;
    }

    .subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      color: #888;
      letter-spacing: 1px;
      font-style: italic;
      margin-bottom: 14px;
    }

    .presented-to {
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 6px;
    }

    .student-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 52px;
      font-weight: 600;
      color: #1a1a2e;
      line-height: 1;
      margin-bottom: 4px;
      position: relative;
      display: inline-block;
    }

    .name-underline {
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #6c63ff, transparent);
      margin: 4px auto 14px;
    }

    .completion-text {
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;
    }

    .course-name {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      font-weight: 600;
      color: #6c63ff;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #6c63ff, #a78bfa);
      color: #fff;
      padding: 6px 18px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .badge-gold {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #c9a84c, #f0d060);
      color: #fff;
      padding: 6px 18px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
    }

    /* Footer signatures */
    .footer {
      position: absolute;
      bottom: 50px;
      left: 80px;
      right: 80px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .sig-block {
      text-align: center;
      min-width: 140px;
    }

    .sig-line {
      width: 140px;
      height: 1px;
      background: #ccc;
      margin: 0 auto 6px;
    }

    .sig-name {
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #333;
    }

    .sig-title {
      font-family: 'Poppins', sans-serif;
      font-size: 9px;
      color: #999;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* Seal */
    .seal {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #c9a84c;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #fffdf0, #fff8e1);
      box-shadow: 0 0 0 2px #e8d48b, 0 4px 12px rgba(201,168,76,0.3);
      position: relative;
    }

    .seal::before {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      border: 1px dashed #c9a84c;
    }

    .seal-text {
      font-family: 'Cinzel', serif;
      font-size: 7px;
      color: #c9a84c;
      letter-spacing: 1px;
      text-align: center;
      font-weight: 600;
      line-height: 1.4;
    }

    .seal-star {
      font-size: 18px;
      margin-bottom: 2px;
    }

    /* Cert ID */
    .cert-id {
      position: absolute;
      bottom: 28px;
      right: 50px;
      font-size: 9px;
      color: #ccc;
      letter-spacing: 1px;
      font-family: monospace;
    }

    @media print {
      body { width: 297mm; height: 210mm; }
      .page { width: 297mm; height: 210mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Borders -->
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <!-- Corner ornaments -->
    <div class="corner tl">❧</div>
    <div class="corner tr">❧</div>
    <div class="corner bl">❧</div>
    <div class="corner br">❧</div>

    <!-- Watermark -->
    <div class="watermark">ALB</div>

    <!-- Left accent bar -->
    <div class="accent-bar"></div>

    <!-- Main content -->
    <div class="content">
      <div class="header">
        <div class="logo-circle">🧠</div>
        <div class="brand-name">AI LearnBoard</div>
      </div>

      <div class="divider-gold"></div>

      <div class="title">Certificate of Completion</div>
      <div class="subtitle">This is proudly presented to</div>

      <div class="presented-to">Student</div>
      <div class="student-name">${userName}</div>
      <div class="name-underline"></div>

      <div class="completion-text">has successfully completed the course</div>
      <div class="course-name">${courseEmoji} &nbsp; ${courseTitle}</div>

      <div class="badge-row">
        <div class="badge">✓ &nbsp; 100% Completed</div>
        <div class="badge-gold">★ &nbsp; Certified</div>
      </div>

      <div class="divider-gold"></div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-name">Dr. Arjun Mehta</div>
        <div class="sig-title">Academic Director</div>
      </div>

      <div class="seal">
        <div class="seal-star">⭐</div>
        <div class="seal-text">VERIFIED<br/>CERTIFICATE</div>
      </div>

      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-name">${date}</div>
        <div class="sig-title">Date of Issue</div>
      </div>
    </div>

    <!-- Certificate ID -->
    <div class="cert-id">Certificate ID: ${certId}</div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AILearnBoard_Certificate_${courseTitle.replace(/\s+/g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
};




// ── Course Quiz Modal ──
const CourseQuizModal = ({ courseTitle, userId, courseId, onPass, onClose }: {
  courseTitle: string; userId: string; courseId: string; onPass: () => void; onClose: () => void;
}) => {
  const { toast } = useToast();
  const questions = getModuleData(courseTitle).quiz;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (current < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    } else {
      // Calculate score
      const score = newAnswers.filter((a, i) => a === questions[i].answer).length;
      setAnswers(newAnswers);
      setFinished(true);
      if (score >= Math.ceil(questions.length * 0.75)) {
        handlePass(score, newAnswers);
      }
    }
  };

  const handlePass = async (score: number, finalAnswers: number[]) => {
    setSubmitting(true);
    // Issue certificate
    const { data: existing } = await supabase.from("certificates")
      .select("id").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
    if (!existing) {
      await supabase.from("certificates").insert({ user_id: userId, course_id: courseId });
    }
    toast({ title: "🎉 Quiz Passed!", description: "Your certificate is ready! Check Achievements to download." });
    setSubmitting(false);
    onPass();
  };

  const score = finished ? answers.filter((a, i) => a === questions[i].answer).length : 0;
  const passed = finished && score >= Math.ceil(questions.length * 0.75);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold">Final Course Quiz</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!finished ? (
            <div className="space-y-5">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{Math.round(((current) / questions.length) * 100)}% done</span>
              </div>
              <Progress value={((current) / questions.length) * 100} className="h-1.5" />

              <p className="font-semibold text-base">{questions[current].q}</p>

              <div className="space-y-2">
                {questions[current].options.map((opt, i) => (
                  <button key={i} onClick={() => setSelected(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      selected === i
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border/60 hover:border-primary/40 hover:bg-muted/40"
                    }`}>
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                ))}
              </div>

              <Button
                className="w-full gradient-primary text-white border-0 font-semibold"
                onClick={handleNext}
                disabled={selected === null}
              >
                {current < questions.length - 1 ? "Next Question →" : "Submit Quiz"}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-5">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl ${passed ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {passed ? "🎉" : "😔"}
              </div>
              <div>
                <h3 className="text-xl font-bold">{passed ? "Quiz Passed!" : "Not quite there"}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  You scored {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
                </p>
                <p className="text-xs text-muted-foreground mt-1">Passing score: 75%</p>
              </div>
              {passed ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-600 font-medium">
                  ✓ Certificate unlocked! Go back to download it.
                </div>
              ) : (
                <Button className="w-full" variant="outline" onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); }}>
                  Try Again
                </Button>
              )}
              {passed && (
                <Button className="w-full gradient-primary text-white border-0" onClick={onClose} disabled={submitting}>
                  {submitting ? "Saving..." : "Back to My Courses"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Course Modules List ──
const CourseModules = ({ userId, courseId, courseTitle, allDone, onProgressUpdate, onCertIssued }: {
  userId: string; courseId: string; courseTitle: string; allDone: boolean; onProgressUpdate: () => void; onCertIssued?: () => void;
}) => {
  const { modules, loading, refetch } = useModuleProgress(userId, courseId);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleDone = () => {
    setActiveModule(null);
    refetch();
    onProgressUpdate();
  };

  if (loading) return <p className="text-xs text-muted-foreground px-4 py-2">Loading modules...</p>;

  const allModulesDone = modules.length > 0 && modules.every(m => m.status === "done");

  return (
    <>
      <div className="border border-border/50 rounded-xl divide-y divide-border/30 mt-2 overflow-hidden">
        {modules.map((mod) => (
          <button
            key={mod.id}
            disabled={mod.status === "locked"}
            onClick={() => mod.status !== "locked" && setActiveModule(mod)}
            className={`flex items-center gap-3 px-4 py-3 text-sm w-full text-left transition-colors
              ${mod.status === "locked" ? "opacity-40 cursor-not-allowed" : "hover:bg-muted/40 cursor-pointer"}
              ${mod.status === "active" ? "bg-primary/5" : ""}`}
          >
            {statusIcon(mod.status)}
            <span className={`flex-1 ${mod.status === "active" ? "text-primary font-medium" : ""}`}>{mod.title}</span>
            {mod.status === "done" && <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">Done</Badge>}
            {mod.status === "active" && <Badge className="text-xs gradient-primary text-white border-0">In Progress</Badge>}
            {mod.status === "locked" && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        ))}

        {/* Final quiz row — after all modules done */}
        {allModulesDone && !allDone && (
          <button
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left bg-primary/5 hover:bg-primary/10 transition-colors border-t-2 border-primary/20"
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="flex-1 text-primary font-semibold">Final Quiz — Unlock Certificate</span>
            <Badge className="gradient-primary text-white border-0 text-xs">Take Quiz →</Badge>
          </button>
        )}
      </div>

      {activeModule && (
        <ModuleViewer
          module={activeModule}
          courseTitle={courseTitle}
          userId={userId}
          courseId={courseId}
          onDone={handleDone}
          onClose={() => setActiveModule(null)}
        />
      )}

      {showQuiz && (
        <CourseQuizModal
          courseTitle={courseTitle}
          userId={userId}
          courseId={courseId}
          onPass={() => { onProgressUpdate(); onCertIssued?.(); setShowQuiz(false); }}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </>
  );
};

const MyCourses = ({ user }: { user: any }) => {
  const { enrollments, loading, refetch: refetchEnrollments } = useEnrollments(user.id);
  const { certificates, refetch: refetchCerts } = useCertificates(user.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  const certMap = Object.fromEntries(certificates.map((c: any) => [c.course_id, c]));
  const userName = user?.user_metadata?.full_name || user?.email || "Student";

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-1">Track and continue your enrolled courses</p>
        </div>
        <Link to="/courses">
          <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
            <ShoppingBag className="w-4 h-4" /> Browse Courses
          </Button>
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-10 text-center space-y-4">
            <div className="text-5xl">📚</div>
            <p className="font-semibold">No courses yet</p>
            <p className="text-muted-foreground text-sm">Browse our catalog and start learning today.</p>
            <Link to="/courses">
              <Button className="gradient-primary text-white border-0">Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {enrollments.map((e: any) => {
            const cert = certMap[e.course_id];
            const isComplete = e.progress === 100;
            return (
              <Card key={e.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{e.courses?.emoji || "📚"}</span>
                      <div>
                        <CardTitle className="text-base">{e.courses?.title}</CardTitle>
                        {e.last_lesson && <p className="text-xs text-muted-foreground mt-0.5">Last: {e.last_lesson}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isComplete && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" /> Completed
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-primary border-primary/30">{e.progress}%</Badge>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Progress value={e.progress} className={isComplete ? "[&>div]:bg-green-500" : ""} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button size="sm" className="gradient-primary text-white border-0"
                      onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                      <PlayCircle className="w-4 h-4 mr-1" /> Continue Learning
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                      className="text-muted-foreground gap-1">
                      Modules {expanded === e.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    {/* Certificate button — always visible, locked until 100% */}
                    {cert ? (
                      <Button size="sm"
                        className="ml-auto bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 hover:opacity-90 shadow-md gap-1.5 font-semibold"
                        onClick={() => downloadCertificatePDF(userName, e.courses?.title, e.courses?.emoji || "📚", cert.issued_at)}>
                        <Award className="w-4 h-4" /> Download Certificate (PDF)
                      </Button>
                    ) : (
                      <Button size="sm"
                        className={`ml-auto gap-1.5 font-semibold border ${isComplete ? "border-amber-500/50 text-amber-500 hover:bg-amber-500/10" : "border-border/40 text-muted-foreground cursor-not-allowed opacity-50"}`}
                        variant="outline"
                        disabled={!isComplete}
                        title={isComplete ? "Generating your certificate..." : `Complete the course to unlock your certificate`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        {isComplete ? "Generating..." : `Certificate — ${e.progress}% / 100%`}
                      </Button>
                    )}
                  </div>

                  {expanded === e.id && (
                    <CourseModules
                      userId={user.id}
                      courseId={e.course_id}
                      courseTitle={e.courses?.title || ""}
                      allDone={!!cert}
                      onProgressUpdate={refetchEnrollments}
                      onCertIssued={refetchCerts}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
