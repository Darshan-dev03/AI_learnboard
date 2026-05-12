import { TrendingUp, Target, Brain, Trophy, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { useEnrollments, useStudySessions, useQuizAttempts } from "@/lib/hooks/useDashboard";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Progress = ({ user }: { user: any }) => {
  const { enrollments } = useEnrollments(user.id);
  const { sessions } = useStudySessions(user.id);
  const { attempts } = useQuizAttempts(user.id);

  const avgCompletion = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  const avgQuiz = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length)
    : 0;

  // Build weekly chart data from sessions
  const weeklyData = DAYS.map(day => {
    const sess = sessions.find(s => new Date(s.study_date).toLocaleDateString("en-US", { weekday: "short" }) === day);
    const att = attempts.find(a => new Date(a.attempted_at).toLocaleDateString("en-US", { weekday: "short" }) === day);
    return { day, hours: sess ? Number(sess.hours_studied) : 0, quiz: att ? Math.round((att.score / att.total) * 100) : 0 };
  });

  const completedModules = enrollments.reduce((s, e) => s + Math.round((e.progress / 100) * (e.courses?.module_count || 4)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor your learning performance and growth</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Course Completion", value: `${avgCompletion}%`, icon: TrendingUp, color: "text-blue-400" },
          { label: "Quiz Accuracy", value: attempts.length ? `${avgQuiz}%` : "—", icon: Target, color: "text-green-400" },
          { label: "Modules Completed", value: completedModules, icon: BookOpen, color: "text-purple-400" },
          { label: "Courses Enrolled", value: enrollments.length, icon: Brain, color: "text-orange-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Progress Radar */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Course Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                No courses enrolled yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={enrollments.slice(0, 6).map(e => ({
                  course: e.courses?.title?.split(" ").slice(0, 2).join(" ") || "Course",
                  progress: e.progress,
                }))}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="course" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Progress" dataKey="progress" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: any) => [`${v}%`, "Progress"]} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="quiz" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Course Completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses enrolled yet.</p>
          ) : enrollments.map((e) => (
            <div key={e.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{e.courses?.title}</span>
                <span className="font-medium text-primary">{e.progress}%</span>
              </div>
              <ProgressBar value={e.progress} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Quiz History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
          ) : attempts.map((a) => {
            const pct = Math.round((a.score / a.total) * 100);
            return (
              <div key={a.id} className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{a.quizzes?.topic || "Quiz"}</span>
                    <Badge variant="outline" className={`text-xs ${pct >= 80 ? "text-green-400 border-green-400/30" : pct >= 60 ? "text-yellow-400 border-yellow-400/30" : "text-red-400 border-red-400/30"}`}>{pct}%</Badge>
                  </div>
                  <ProgressBar value={pct} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
