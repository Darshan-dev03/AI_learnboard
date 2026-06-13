import { useEffect, useState } from "react";
import { Trophy, Award, Users, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const AdminAchievements = () => {
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalBadges: 0, totalAwarded: 0, uniqueHolders: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: b }, { data: ub }, { count: totalAwarded }] = await Promise.all([
      supabase.from("badges").select("*"),
      supabase.from("user_badges").select("*, profiles(full_name), badges(name, icon)").order("earned_at", { ascending: false }).limit(15),
      supabase.from("user_badges").select("*", { count: "exact", head: true }),
    ]);
    
    setBadges(b || []);
    setUserBadges(ub || []);
    
    // Calculate unique badge holders
    const uniqueUsers = new Set((ub || []).map((item: any) => item.user_id));
    
    setStats({
      totalBadges: (b || []).length,
      totalAwarded: totalAwarded || 0,
      uniqueHolders: uniqueUsers.size,
    });
    
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const statCards = [
    { label: "Total Badges", value: stats.totalBadges, icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Badges Awarded", value: stats.totalAwarded, icon: Award, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Badge Holders", value: stats.uniqueHolders, icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-muted-foreground text-sm mt-1">Badges and awards management</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> All Badges ({badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {badges.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">{b.criteria}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" /> Recently Awarded Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
            {userBadges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No badges awarded yet.</p>
            ) : userBadges.map((ub, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl">{ub.badges?.icon || "🏆"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{ub.profiles?.full_name || "Student"}</p>
                  <p className="text-xs text-muted-foreground">earned <span className="font-medium text-foreground">"{ub.badges?.name}"</span></p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {new Date(ub.earned_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ub.earned_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAchievements;
