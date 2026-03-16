import { Trophy, Star, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAchievements, useEnrollments } from "@/lib/hooks/useDashboard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const Achievements = ({ user }: { user: any }) => {
  const { allBadges, userBadges, loading } = useAchievements(user.id);
  const { enrollments } = useEnrollments(user.id);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, total_points").order("total_points", { ascending: false }).limit(10)
      .then(({ data }) => setLeaderboard(data || []));
  }, []);

  const earnedIds = new Set(userBadges.map(ub => ub.badge_id));
  const completedCourses = enrollments.filter(e => e.progress === 100);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements & Certificates</h1>
        <p className="text-muted-foreground mt-1">Your learning milestones and rewards</p>
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
            ) : completedCourses.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                <div>
                  <p className="text-sm font-medium">{e.courses?.title}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <button className="text-xs text-primary font-semibold hover:underline">Download →</button>
              </div>
            ))}
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
