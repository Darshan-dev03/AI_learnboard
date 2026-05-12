import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const AdminAchievements = () => {
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: b }, { data: ub }] = await Promise.all([
        supabase.from("badges").select("*"),
        supabase.from("user_badges").select("*, profiles(full_name), badges(name, icon)").order("earned_at", { ascending: false }).limit(20),
      ]);
      setBadges(b || []);
      setUserBadges(ub || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground text-sm mt-1">Badges and awards management</p>
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
            <CardTitle className="text-base">Recent Awards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userBadges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No badges awarded yet.</p>
            ) : userBadges.map((ub, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/50">
                <span className="text-xl">{ub.badges?.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ub.profiles?.full_name || "Student"}</p>
                  <p className="text-xs text-muted-foreground">earned "{ub.badges?.name}"</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(ub.earned_at).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAchievements;
