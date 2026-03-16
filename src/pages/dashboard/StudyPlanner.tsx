import { CheckCircle, PlayCircle, Brain, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudyPlan } from "@/lib/hooks/useDashboard";
import { supabase } from "@/lib/supabase";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const weekStart = new Date();
weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
const weekStartStr = weekStart.toISOString().split("T")[0];

const StudyPlanner = ({ user }: { user: any }) => {
  const { plan, loading, toggleTopic } = useStudyPlan(user.id);

  const addTopic = async (day: string) => {
    const topic = prompt(`Add topic for ${day}:`);
    if (!topic?.trim()) return;
    await supabase.from("study_plan_topics").insert({
      user_id: user.id, day_of_week: day, topic_name: topic.trim(), week_start: weekStartStr,
    });
  };

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = plan.filter(p => p.day_of_week === day);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Study Planner</h1>
        <p className="text-muted-foreground mt-1">Your weekly study schedule — click topics to mark done</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> AI Tip for Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Focus on your weakest topics first. Consistent daily practice beats long weekend sessions.</p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map(day => {
          const topics = grouped[day] || [];
          const isToday = day === today;
          const doneCount = topics.filter(t => t.is_done).length;
          return (
            <Card key={day} className={`border ${isToday ? "border-primary/50 bg-primary/5" : "border-border/50"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {day}
                  </CardTitle>
                  {isToday && <Badge className="gradient-primary text-primary-foreground border-0 text-xs">Today</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{doneCount}/{topics.length} done</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map(t => (
                  <button key={t.id} onClick={() => toggleTopic(t.id, !t.is_done)}
                    className={`flex items-center gap-2 text-sm w-full text-left hover:opacity-80 transition-opacity ${t.is_done ? "text-muted-foreground line-through" : ""}`}>
                    {t.is_done
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      : <PlayCircle className="w-3.5 h-3.5 text-primary shrink-0" />}
                    {t.topic_name}
                  </button>
                ))}
                <Button size="sm" variant="ghost" className="w-full text-xs text-muted-foreground gap-1 h-7 mt-1" onClick={() => addTopic(day)}>
                  <Plus className="w-3 h-3" /> Add topic
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudyPlanner;
