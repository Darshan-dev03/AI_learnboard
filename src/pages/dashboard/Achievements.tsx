import { Trophy, Star, Lock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAchievements, useEnrollments, useQuizAttempts, useCertificates } from "@/lib/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {  } from "@/lib/certificate";

const downloadCert = (userName: string, courseTitle: string, issuedAt: string) => {
  const date = new Date(issuedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const certId = "ALB-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Certificate</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Poppins:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{width:1122px;height:794px;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Poppins',sans-serif}
.page{width:1122px;height:794px;position:relative;background:#fff;overflow:hidden}
.border-outer{position:absolute;inset:18px;border:3px solid #c9a84c}.border-inner{position:absolute;inset:26px;border:1px solid #e8d48b}
.corner{position:absolute;width:60px;height:60px;font-size:36px;display:flex;align-items:center;justify-content:center;color:#c9a84c}
.tl{top:10px;left:10px}.tr{top:10px;right:10px;transform:scaleX(-1)}.bl{bottom:10px;left:10px;transform:scaleY(-1)}.br{bottom:10px;right:10px;transform:scale(-1)}
.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:180px;opacity:.04;color:#6c63ff;font-family:'Cinzel',serif;font-weight:700;white-space:nowrap;pointer-events:none}
.accent{position:absolute;left:40px;top:40px;bottom:40px;width:6px;background:linear-gradient(180deg,#6c63ff,#a78bfa,#c9a84c);border-radius:3px}
.content{position:absolute;inset:40px 50px 40px 70px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.brand{font-family:'Cinzel',serif;font-size:15px;letter-spacing:4px;text-transform:uppercase;color:#6c63ff;font-weight:600;margin-bottom:6px}
.divider{width:200px;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:10px auto}
.title{font-family:'Cinzel',serif;font-size:38px;font-weight:700;color:#1a1a2e;letter-spacing:2px;margin-bottom:4px}
.sub{font-family:'Cormorant Garamond',serif;font-size:16px;color:#888;font-style:italic;margin-bottom:14px}
.name{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:600;color:#1a1a2e;line-height:1}
.name-line{width:100%;height:2px;background:linear-gradient(90deg,transparent,#6c63ff,transparent);margin:4px auto 14px}
.course-label{font-size:12px;color:#666;margin-bottom:6px}.course{font-family:'Cinzel',serif;font-size:20px;font-weight:600;color:#6c63ff;letter-spacing:1px;margin-bottom:16px}
.badges{display:flex;gap:12px;margin-bottom:20px}
.badge{display:inline-flex;align-items:center;gap:6px;padding:6px 18px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:1px}
.bp{background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#fff}.bg{background:linear-gradient(135deg,#c9a84c,#f0d060);color:#fff}
.footer{position:absolute;bottom:50px;left:80px;right:80px;display:flex;align-items:flex-end;justify-content:space-between}
.sig{text-align:center;min-width:140px}.sig-line{width:140px;height:1px;background:#ccc;margin:0 auto 6px}
.sig-name{font-size:11px;font-weight:600;color:#333}.sig-title{font-size:9px;color:#999;letter-spacing:1px;text-transform:uppercase;margin-top:2px}
.seal{width:80px;height:80px;border-radius:50%;border:3px solid #c9a84c;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle,#fffdf0,#fff8e1);box-shadow:0 0 0 2px #e8d48b,0 4px 12px rgba(201,168,76,.3);position:relative}
.seal::before{content:'';position:absolute;inset:4px;border-radius:50%;border:1px dashed #c9a84c}
.seal-text{font-family:'Cinzel',serif;font-size:7px;color:#c9a84c;letter-spacing:1px;text-align:center;font-weight:600;line-height:1.4}
.cert-id{position:absolute;bottom:28px;right:50px;font-size:9px;color:#ccc;letter-spacing:1px;font-family:monospace}
</style></head><body><div class="page">
<div class="border-outer"></div><div class="border-inner"></div>
<div class="corner tl">❧</div><div class="corner tr">❧</div><div class="corner bl">❧</div><div class="corner br">❧</div>
<div class="watermark">ALB</div><div class="accent"></div>
<div class="content">
<div class="brand">🧠 &nbsp; AI LearnBoard</div><div class="divider"></div>
<div class="title">Certificate of Completion</div>
<div class="sub">This is proudly presented to</div>
<div class="name">${userName}</div><div class="name-line"></div>
<div class="course-label">has successfully completed the course</div>
<div class="course">${courseTitle}</div>
<div class="badges"><div class="badge bp">✓ &nbsp; 100% Completed</div><div class="badge bg">★ &nbsp; Certified</div></div>
<div class="divider"></div></div>
<div class="footer">
<div class="sig"><div class="sig-line"></div><div class="sig-name">Dr. Arjun Mehta</div><div class="sig-title">Academic Director</div></div>
<div class="seal"><div style="font-size:18px;margin-bottom:2px">⭐</div><div class="seal-text">VERIFIED<br/>CERTIFICATE</div></div>
<div class="sig"><div class="sig-line"></div><div class="sig-name">${date}</div><div class="sig-title">Date of Issue</div></div>
</div>
<div class="cert-id">Certificate ID: ${certId}</div>
</div></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AILearnBoard_Certificate_${courseTitle.replace(/\s+/g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const Achievements = ({ user }: { user: any }) => {
  const { allBadges, userBadges, loading } = useAchievements(user.id);
  const { enrollments } = useEnrollments(user.id);
  const { attempts } = useQuizAttempts(user.id);
  const { certificates } = useCertificates(user.id);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, total_points").order("total_points", { ascending: false }).limit(10)
      .then(({ data }) => setLeaderboard(data || []));
  }, []);

  const earnedIds = new Set(userBadges.map(ub => ub.badge_id));
  const completedCourses = enrollments.filter(e => e.progress === 100);
  const bestQuiz = attempts.length > 0 ? Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100))) : 0;
  const certMap = Object.fromEntries(certificates.map((c: any) => [c.course_id, c]));
  const userName = user?.user_metadata?.full_name || user?.email || "Student";

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements & Badges</h1>
        <p className="text-muted-foreground mt-1">Your learning milestones and rewards</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Badges Earned", value: userBadges.length, icon: "🏅" },
          { label: "Courses Done", value: completedCourses.length, icon: "🎓" },
          { label: "Quiz Attempts", value: attempts.length, icon: "🧠" },
          { label: "Best Quiz Score", value: bestQuiz > 0 ? `${bestQuiz}%` : "—", icon: "🏆" },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {allBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBadges.map(badge => {
                const earned = earnedIds.has(badge.id);
                const earnedData = userBadges.find(ub => ub.badge_id === badge.id);
                return (
                  <div key={badge.id} className={`p-4 rounded-xl border transition-all ${earned ? "border-primary/30 bg-primary/5" : "border-border/30 opacity-60"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{badge.name}</p>
                          {earned ? <Badge className="gradient-primary text-primary-foreground border-0 text-xs">Earned</Badge>
                            : <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                        {earned && earnedData?.earned_at && (
                          <p className="text-xs text-primary mt-1">{new Date(earnedData.earned_at).toLocaleDateString()}</p>
                        )}
                        {!earned && (
                          <div className="mt-2 space-y-1">
                            <Progress value={0} className="h-1" />
                            <p className="text-xs text-muted-foreground">Not yet earned</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">🎓 Certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Complete a course to earn your certificate!</p>
            ) : completedCourses.map(e => {
              const cert = certMap[e.course_id];
              return (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{e.courses?.emoji || "📚"}</span>
                    <div>
                      <p className="text-sm font-medium">{e.courses?.title}</p>
                      <p className="text-xs text-muted-foreground">100% Completed</p>
                    </div>
                  </div>
                  {cert ? (
                    <button
                      onClick={() => downloadCertificatePDF(userName, e.courses?.title || "Course", e.courses?.emoji || "📚", cert.issued_at)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Cert pending</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leaderboard data yet.</p>
            ) : leaderboard.map((p, idx) => {
              const isYou = p.id === user.id;
              return (
                <div key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isYou ? "gradient-primary text-primary-foreground" : "hover:bg-muted/50"}`}>
                  <span className={`text-sm font-bold w-6 ${idx < 3 ? "text-yellow-400" : ""}`}>#{idx + 1}</span>
                  <span className="flex-1 text-sm font-medium">{p.full_name || "Student"} {isYou && "(You)"}</span>
                  <span className="text-sm font-semibold">{p.total_points} pts</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;
