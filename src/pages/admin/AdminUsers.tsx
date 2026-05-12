import { useEffect, useState } from "react";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    
    // Get profiles data
    const { data: profilesData, error: profilesErr } = await supabase
      .from("profiles")
      .select("id, full_name, created_at, skill_level, study_streak, total_points, last_study_date")
      .order("created_at", { ascending: false });

    if (profilesErr) {
      console.error("AdminUsers error:", profilesErr);
      setError(`Failed to load users: ${profilesErr.message}`);
      setLoading(false);
      return;
    }

    // Determine activity based on multiple factors
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const enrichedUsers = (profilesData || []).map(profile => {
      // User is active if:
      // 1. They have a study streak > 0 (currently studying)
      // 2. Last study date is within 7 days
      // 3. Account created within last 7 days (new users)
      const lastStudy = profile.last_study_date ? new Date(profile.last_study_date) : null;
      const accountCreated = new Date(profile.created_at);
      
      const isActive = 
        profile.study_streak > 0 ||
        (lastStudy && lastStudy > sevenDaysAgo) ||
        accountCreated > sevenDaysAgo;
      
      return {
        ...profile,
        isActive,
        lastActivity: lastStudy || accountCreated
      };
    });

    setUsers(enrichedUsers);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} registered students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error loading users</p>
            <p className="text-xs mt-0.5 opacity-80">{error}</p>
            <p className="text-xs mt-1 opacity-60">Make sure you've run the RLS fix SQL in Supabase.</p>
          </div>
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {["User", "Skill Level", "Streak", "Points", "Joined", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      {error ? "Fix the error above to see users." : "No users found."}
                    </td>
                  </tr>
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(u.full_name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.full_name || "Student"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.skill_level || "Beginner"}</td>
                    <td className="px-4 py-3">🔥 {u.study_streak || 0}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{u.total_points || 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {u.isActive ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 border text-xs w-fit">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20 border text-xs w-fit">Inactive</Badge>
                        )}
                        {u.lastActivity && (
                          <span className="text-xs text-muted-foreground">
                            {u.last_study_date ? 'Studied' : 'Joined'}: {new Date(u.lastActivity).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
