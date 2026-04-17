import { useState } from "react";
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronUp, Award, Download, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useEnrollments, useModuleProgress, useCertificates } from "@/lib/hooks/useDashboard";
import { useToast } from "@/hooks/use-toast";

const statusIcon = (status: string) => {
  if (status === "done") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "active") return <PlayCircle className="w-4 h-4 text-primary" />;
  return <Lock className="w-4 h-4 text-muted-foreground" />;
};

// Generate a simple HTML certificate and trigger download
const downloadCertificate = (userName: string, courseTitle: string, courseEmoji: string, issuedAt: string) => {
  const date = new Date(issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Certificate – ${courseTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600&display=swap');
    body { margin:0; background:#f8f7ff; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Poppins',sans-serif; }
    .cert { width:800px; background:#fff; border:2px solid #6c63ff; border-radius:16px; padding:60px; text-align:center; box-shadow:0 20px 60px rgba(108,99,255,0.15); position:relative; }
    .cert::before { content:''; position:absolute; inset:8px; border:1px solid #e0dcff; border-radius:12px; pointer-events:none; }
    .emoji { font-size:64px; margin-bottom:8px; }
    .brand { font-size:13px; letter-spacing:3px; text-transform:uppercase; color:#9b8fff; margin-bottom:32px; }
    h1 { font-family:'Playfair Display',serif; font-size:42px; color:#1a1a2e; margin:0 0 8px; }
    .sub { font-size:14px; color:#888; margin-bottom:32px; }
    .name { font-family:'Playfair Display',serif; font-size:36px; color:#6c63ff; border-bottom:2px solid #e0dcff; display:inline-block; padding-bottom:8px; margin-bottom:24px; }
    .course { font-size:18px; color:#333; margin-bottom:8px; }
    .course strong { color:#1a1a2e; }
    .date { font-size:13px; color:#aaa; margin-top:32px; }
    .badge { display:inline-block; background:linear-gradient(135deg,#6c63ff,#a78bfa); color:#fff; padding:8px 24px; border-radius:999px; font-size:13px; font-weight:600; margin-top:24px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="emoji">${courseEmoji}</div>
    <div class="brand">AI LearnBoard</div>
    <h1>Certificate of Completion</h1>
    <p class="sub">This is to certify that</p>
    <div class="name">${userName}</div>
    <p class="course">has successfully completed the course</p>
    <p class="course"><strong>${courseTitle}</strong></p>
    <div class="badge">✓ 100% Completed</div>
    <p class="date">Issued on ${date}</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Certificate_${courseTitle.replace(/\s+/g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const CourseModules = ({ userId, courseId, onProgressUpdate }: { userId: string; courseId: string; onProgressUpdate: () => void }) => {
  const { modules, loading } = useModuleProgress(userId, courseId);
  const { toast } = useToast();

  const markDone = async (moduleId: string) => {
    await supabase.from("module_progress").upsert({ user_id: userId, module_id: moduleId, status: "done" });

    // Recalculate enrollment progress
    const { data: allMods } = await supabase.from("course_modules").select("id").eq("course_id", courseId);
    const { data: doneMods } = await supabase.from("module_progress")
      .select("id").eq("user_id", userId).eq("status", "done")
      .in("module_id", (allMods || []).map((m: any) => m.id));

    const total = allMods?.length || 1;
    const done = doneMods?.length || 0;
    const progress = Math.round((done / total) * 100);

    await supabase.from("enrollments")
      .update({ progress, last_lesson: modules.find(m => m.id === moduleId)?.title })
      .eq("user_id", userId).eq("course_id", courseId);

    if (progress === 100) {
      // Auto-issue certificate
      const { data: existing } = await supabase.from("certificates")
        .select("id").eq("user_id", userId).eq("course_id", courseId).single();
      if (!existing) {
        await supabase.from("certificates").insert({ user_id: userId, course_id: courseId });
        toast({ title: "🎉 Course Complete!", description: "Your certificate is ready to download!" });
      }
    }

    onProgressUpdate();
  };

  if (loading) return <p className="text-xs text-muted-foreground px-4 py-2">Loading modules...</p>;

  return (
    <div className="border border-border/50 rounded-lg divide-y divide-border/30 mt-2">
      {modules.map((mod) => (
        <div key={mod.id} className={`flex items-center gap-3 px-4 py-3 text-sm ${mod.status === "locked" ? "opacity-50" : ""}`}>
          {statusIcon(mod.status)}
          <span className={`flex-1 ${mod.status === "active" ? "text-primary font-medium" : ""}`}>{mod.title}</span>
          {mod.status === "active" && (
            <Button size="sm" className="h-7 text-xs gradient-primary text-white border-0" onClick={() => markDone(mod.id)}>
              Mark Done
            </Button>
          )}
          {mod.status === "done" && <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">Done</Badge>}
        </div>
      ))}
    </div>
  );
};

const MyCourses = ({ user }: { user: any }) => {
  const { enrollments, loading, refetch } = useEnrollments(user.id) as any;
  const { certificates } = useCertificates(user.id);
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

                    {/* Certificate button — only if 100% */}
                    {cert ? (
                      <Button size="sm"
                        className="ml-auto bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20 gap-1"
                        onClick={() => downloadCertificate(userName, e.courses?.title, e.courses?.emoji || "📚", cert.issued_at)}>
                        <Download className="w-4 h-4" /> Download Certificate
                      </Button>
                    ) : isComplete ? (
                      <Button size="sm" variant="outline" className="ml-auto gap-1 opacity-60" disabled>
                        <Award className="w-4 h-4" /> Generating...
                      </Button>
                    ) : (
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Certificate at 100%</span>
                      </div>
                    )}
                  </div>

                  {expanded === e.id && (
                    <CourseModules
                      userId={user.id}
                      courseId={e.course_id}
                      onProgressUpdate={() => {
                        // trigger re-fetch via supabase realtime (already subscribed in useEnrollments)
                      }}
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
