import { useEffect, useState } from "react";
import { Users, BookOpen, CreditCard, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Spinner = () => <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        { count: users },
        { count: courses },
        { count: enrollments },
        { data: payments },
        { data: latestUsers },
        { data: latestPayments },
        { data: enrollByDay },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("amount_inr, paid_at"),
        supabase.from("profiles").select("id, full_name, created_at, skill_level").order("created_at", { ascending: false }).limit(6),
        supabase.from("payments").select("amount_inr, status, paid_at, profiles(full_name), courses(title, emoji)").order("paid_at", { ascending: false }).limit(5),
        supabase.from("enrollments").select("enrolled_at"),
      ]);

      const revenue = (payments || []).reduce((s: number, p: any) => s + (p.amount_inr || 0), 0);

      // Build last 7 days chart from real enrollment data
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString("en-US", { weekday: "short" }) };
      });
      const chart = days.map(({ date, day }) => ({
        day,
        enrollments: (enrollByDay || []).filter((e: any) =>
          e.enrolled_at?.startsWith(date)
        ).length,
      }));

      setStats({ users: users || 0, courses: courses || 0, enrollments: enrollments || 0, revenue });
      setRecentUsers(latestUsers || []);
      setRecentPayments(latestPayments || []);
      setChartData(chart);
    } catch (e: any) {
      setError("Failed to load dashboard data. Check RLS policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-destructive text-sm">{error}</p>
      <button onClick={load} className="flex items-center gap-2 text-sm text-primary hover:underline">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Courses", value: stats.courses, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Enrollments", value: stats.enrollments, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, Admin</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Activity className="w-4 h-4 text-primary" /> Enrollments — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-500" /> Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : recentPayments.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <span className="text-xl">{p.courses?.emoji || "📚"}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.profiles?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{p.courses?.title || "Course"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-500">{p.amount_inr === 0 ? "Free" : `₹${p.amount_inr.toLocaleString()}`}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No users yet.</p>
            ) : recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {(u.full_name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.full_name || "Student"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">{u.skill_level || "Beginner"}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
