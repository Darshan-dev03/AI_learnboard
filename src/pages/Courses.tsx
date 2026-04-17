import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, BarChart2, Sparkles, Users, CheckCircle, X, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";


const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("courses").select("*").eq("is_published", true).then(({ data }) => setCourses(data || []));
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("enrollments").select("course_id").eq("user_id", user.id)
          .then(({ data }) => setEnrolledIds((data || []).map((e: any) => e.course_id)));
      }
    });
  }, []);

  const handleEnroll = async (course: any) => {
    if (!user) { navigate("/login"); return; }
    setSelected(course);
  };

  const confirmPayment = async () => {
    if (!selected || !user) return;
    setPaying(true);
    try {
      // Simulate payment — in production integrate Razorpay here
      const { error: payErr } = await supabase.from("payments").insert({
        user_id: user.id,
        course_id: selected.id,
        amount_inr: selected.price_inr,
        status: "paid",
      });
      if (payErr) throw payErr;

      const { error: enrollErr } = await supabase.from("enrollments").upsert({
        user_id: user.id,
        course_id: selected.id,
        progress: 0,
      });
      if (enrollErr) throw enrollErr;

      setEnrolledIds((prev) => [...prev, selected.id]);
      toast({ title: "Enrolled!", description: `You're now enrolled in ${selected.title}` });
      setSelected(null);
      navigate("/dashboard/courses");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary hover:-translate-x-1 hover:shadow-md px-4 py-2 rounded-lg transition-all duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Badge className="gradient-primary text-primary-foreground border-0 px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> AI-Curated
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Handpicked software courses. Pay once, learn at your own pace.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrolled = enrolledIds.includes(course.id);
            return (
              <div key={course.id}
                className="group bg-card rounded-xl border border-border hover:border-primary/50 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-36 gradient-hero flex items-center justify-center text-5xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-500" />
                  <span className="relative z-10">{course.emoji}</span>
                  {enrolled && (
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                    </Badge>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${levelColor[course.level] || "bg-muted text-muted-foreground"}`}>
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" /> {course.duration_weeks}w
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-lg gradient-text">
                      {course.is_free ? "Free" : `₹${course.price_inr}`}
                    </span>
                    <Button
                      size="sm"
                      className={enrolled ? "bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20" : "gradient-primary text-white border-0"}
                      onClick={() => enrolled ? navigate("/dashboard/courses") : handleEnroll(course)}
                    >
                      {enrolled ? "Go to Course" : course.is_free ? "Enroll Free" : "Buy ₹" + course.price_inr}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>


      {/* Payment Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">Complete Purchase</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Course summary */}
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl">
                <span className="text-4xl">{selected.emoji}</span>
                <div>
                  <p className="font-semibold">{selected.title}</p>
                  <p className="text-sm text-muted-foreground">{selected.level} · {selected.duration_weeks} weeks</p>
                </div>
              </div>

              {/* What you get */}
              <div className="space-y-2">
                {["Lifetime access", "Progress tracking", "Certificate on completion", "AI-powered learning path"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold gradient-text">
                  {selected.is_free ? "Free" : `₹${selected.price_inr}`}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Secure simulated payment — no real transaction</span>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Cancel</Button>
              <Button
                className="flex-1 gradient-primary text-white border-0 font-semibold"
                onClick={confirmPayment}
                disabled={paying}
              >
                {paying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : selected.is_free ? "Enroll Free" : `Pay ₹${selected.price_inr}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
