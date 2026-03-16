import { BookOpen, CheckCircle, Flame, Target, Brain, Trophy, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEnrollments, useProfile, useQuizAttempts, useAchievements } from "@/lib/hooks/useDashboard";
import { Link } from "react-router-dom";

const DashboardHome = ({ user }: { user: any }) => {
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "Student";
  const { profile } = useProfile(user.id);
  const { enrollments, loading: eLoading } = useEnrollments(user.id);
  const { attempts } = useQuizAttempts(user.id);
  const { userBadges } = useAchievements(user.id);

  const avgQuiz = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length)
    : 0;

  const lessonsCompleted = enrollments.reduce((s, e) => s + Math.round((e.progress / 100) * 4), 0);

  const stats = [
    { label: "Courses Enrolled", value: eLoading ? "—" : enrollments.length, icon: BookOpen, color: "text-blue-400" },
    { label: "Lessons Completed", value: eLoading ? "—" : lessonsCompleted, icon: CheckCircle, color: "text-green-400" },
    { label: "Quiz Score (Avg)", value: attempts.length ? `${avgQuiz}%` : "—", icon: TrendingUp, color: "text-purple-400" },
    { label: "Study Streak", value: profile ? `${profile.study_streak} days` : "—", icon: Flame, color: "text-orange-400" },
  ];

  const dailyGoal = profile?.daily_goal === "1 lesson/day" ? 1 : profile?.daily_goal === "3 lessons/day" ? 3 : profile?.daily_goal === "5 lessons/day" ? 5 : 2;
  const todayLessons = 1; // can be tracked via study_sessions
  const goalPct = Math.min(100, Math.round((todayLessons / dailyGoal) * 100));

  const topCourses = enrollments.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">👋 Welcome back, {name}!</h1>
          <p className="text-muted-foreground mt-1">Here's your learning summary for today.</p>
        </div>
        {profile?.study_streak > 0 && (
          <Badge className="gradient-primary text-primary-foreground border-0 px-4 py-2 text-sm w-fit">
            <Flame className="w-4 h-4 mr-1" /> {profile.study_streak} Day Streak
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/50 hover:border-primary/30 transition-colors">
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

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Today's Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Daily target</span>
                <span className="text-primary font-medium">{todayLessons} / {dailyGoal} lessons</span>
              </div>
              <Progress value={goalPct} />
            </div>
            <p className="text-xs text-muted-foreground">
              {goalPct >= 100 ? "🎉 Goal achieved!" : `Complete ${dailyGoal - todayLessons} more lesson(s) to hit your goal!`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCourses[0] ? (
              <>
                <p className="text-sm font-medium">Continue {topCourses[0].courses?.title}</p>
                <p className="text-xs text-muted-foreground">You're at {topCourses[0].progress}% — keep going!</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Enroll in a course to get started</p>
                <p className="text-xs text-muted-foreground">Browse our AI-curated course catalog.</p>
              </>
            )}
            <Link to="/dashboard/courses" className="text-xs text-primary font-semibold hover:underline">Start Now →</Link>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Weekly Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium">Quiz available now!</p>
            <p className="text-xs text-muted-foreground">Test your knowledge and track weak areas.</p>
            <Link to="/dashboard/quiz" className="text-xs text-primary font-semibold hover:underline">Take Quiz →</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses enrolled yet. <Link to="/dashboard/courses" className="text-primary hover:underline">Browse courses →</Link></p>
            ) : topCourses.map((e) => (
              <div key={e.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{e.courses?.title}</span>
                  <span className="text-primary font-medium ml-2 shrink-0">{e.progress}%</span>
                </div>
                <Progress value={e.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBadges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No badges earned yet. Keep learning!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {userBadges.slice(0, 4).map((ub) => (
                  <div key={ub.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-sm">
                    <span>{ub.badges?.icon}</span>
                    <span className="font-medium">{ub.badges?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
