import { useEffect, useState } from "react";
import { BookOpen, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

const AdminCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: coursesData } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      const { data: enrollData } = await supabase.from("enrollments").select("course_id, progress");

      const enriched = (coursesData || []).map(c => {
        const courseEnrolls = (enrollData || []).filter(e => e.course_id === c.id);
        const avgProgress = courseEnrolls.length
          ? Math.round(courseEnrolls.reduce((s, e) => s + e.progress, 0) / courseEnrolls.length)
          : 0;
        return { ...c, enrollCount: courseEnrolls.length, avgProgress };
      });

      setCourses(enriched);
      setLoading(false);
    };
    load();
  }, []);

  const levelColor: Record<string, string> = {
    Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-muted-foreground text-sm mt-1">{courses.length} courses in catalog</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map(c => (
          <Card key={c.id} className="border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`border text-xs ${levelColor[c.level] || "bg-muted text-muted-foreground border-border"}`}>{c.level}</Badge>
                <Badge variant="outline" className="text-xs">{c.duration_weeks}w</Badge>
                <Badge className={`border text-xs ${c.is_free ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                  {c.is_free ? "Free" : `₹${c.price_inr}`}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.enrollCount} enrolled</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {c.avgProgress}% avg progress</span>
                </div>
                <Progress value={c.avgProgress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
