import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "#a78bfa", "#34d399", "#f59e0b", "#f87171", "#60a5fa"];

const AdminAnalytics = () => {
  const [courseEnrollData, setCourseEnrollData] = useState<any[]>([]);
  const [progressDist, setProgressDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fetch enrollments (progress only — no join to avoid RLS issues)
      const { data: enrollments, error: enrollErr } = await supabase
        .from("enrollments")
        .select("course_id, progress");

      if (enrollErr) {
        setError(enrollErr.message);
        setLoading(false);
        return;
      }

      // Fetch courses separately
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, emoji");

      const courseMap = Object.fromEntries((courses || []).map((c: any) => [c.id, c]));

      // Enrollments per course
      const countMap: Record<string, { name: string; count: number }> = {};
      (enrollments || []).forEach((e: any) => {
        const course = courseMap[e.course_id];
        if (!course) return;
        const key = e.course_id;
        const label = `${course.emoji || ""} ${course.title?.split(" ").slice(0, 2).join(" ")}`;
        if (!countMap[key]) countMap[key] = { name: label, count: 0 };
        countMap[key].count++;
      });
      setCourseEnrollData(Object.values(countMap).sort((a, b) => b.count - a.count));

      // Progress distribution buckets
      const buckets = [
        { name: "Not Started (0%)", count: 0 },
        { name: "Early (1–25%)", count: 0 },
        { name: "Halfway (26–50%)", count: 0 },
        { name: "Advanced (51–75%)", count: 0 },
        { name: "Almost (76–99%)", count: 0 },
        { name: "Completed (100%)", count: 0 },
      ];

      (enrollments || []).forEach((e: any) => {
        const p = Number(e.progress) || 0;
        if (p === 0) buckets[0].count++;
        else if (p <= 25) buckets[1].count++;
        else if (p <= 50) buckets[2].count++;
        else if (p <= 75) buckets[3].count++;
        else if (p < 100) buckets[4].count++;
        else buckets[5].count++;
      });

      setProgressDist(buckets.filter(b => b.count > 0));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance insights</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          Error: {error} — Run the RLS fix SQL in Supabase.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollments per Course */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Enrollments per Course</CardTitle>
          </CardHeader>
          <CardContent>
            {courseEnrollData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enrollment data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={courseEnrollData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={130}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle}
                    formatter={(v: any) => [v, "Enrollments"]} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {progressDist.length === 0 ? (
              <p className="text-sm text-muted-foreground">No progress data yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={progressDist}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {progressDist.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: any, name: any) => [v, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom legend below chart */}
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {progressDist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span>{item.name} — <strong className="text-foreground">{item.count}</strong></span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
