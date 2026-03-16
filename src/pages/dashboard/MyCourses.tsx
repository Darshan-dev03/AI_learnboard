import { useState } from "react";
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrollments, useModuleProgress } from "@/lib/hooks/useDashboard";

const statusIcon = (status: string) => {
  if (status === "done") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "active") return <PlayCircle className="w-4 h-4 text-primary" />;
  return <Lock className="w-4 h-4 text-muted-foreground" />;
};

const CourseModules = ({ userId, courseId }: { userId: string; courseId: string }) => {
  const { modules, loading } = useModuleProgress(userId, courseId);
  if (loading) return <p className="text-xs text-muted-foreground px-4 py-2">Loading modules...</p>;
  return (
    <div className="border border-border/50 rounded-lg divide-y divide-border/30 mt-2">
      {modules.map((mod) => (
        <div key={mod.id} className={`flex items-center gap-3 px-4 py-3 text-sm ${mod.status === "locked" ? "opacity-50" : ""}`}>
          {statusIcon(mod.status)}
          <span className={mod.status === "active" ? "text-primary font-medium" : ""}>{mod.title}</span>
          {mod.status === "active" && <Badge className="ml-auto gradient-primary text-primary-foreground border-0 text-xs">In Progress</Badge>}
        </div>
      ))}
    </div>
  );
};

const MyCourses = ({ user }: { user: any }) => {
  const { enrollments, loading } = useEnrollments(user.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">Track and continue your enrolled courses</p>
      </div>

      {enrollments.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {enrollments.map((e) => (
            <Card key={e.id} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{e.courses?.emoji || "📚"}</span>
                    <div>
                      <CardTitle className="text-base">{e.courses?.title}</CardTitle>
                      {e.last_lesson && <p className="text-xs text-muted-foreground mt-0.5">Last: {e.last_lesson}</p>}
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-primary border-primary/30">{e.progress}%</Badge>
                </div>
                <div className="space-y-1 mt-2">
                  <Progress value={e.progress} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                    <PlayCircle className="w-4 h-4 mr-1" /> Continue Learning
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                    className="text-muted-foreground gap-1">
                    Modules {expanded === e.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                {expanded === e.id && <CourseModules userId={user.id} courseId={e.course_id} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
