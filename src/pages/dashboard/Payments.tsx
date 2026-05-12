import { useEffect, useState } from "react";
import { CreditCard, CheckCircle, Clock, ShoppingCart, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { usePayments } from "@/lib/hooks/useDashboard";
import { initiatePayment } from "@/lib/razorpay";
import { sendPaymentSuccessEmail } from "@/lib/emailService";
import { useToast } from "@/hooks/use-toast";

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

const Payments = ({ user }: { user: any }) => {
  const { payments, loading } = usePayments(user.id);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [paying, setPaying] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("courses").select("*").eq("is_published", true)
      .then(({ data }) => setCourses(data || []));
    supabase.from("enrollments").select("course_id").eq("user_id", user.id)
      .then(({ data }) => setEnrolledIds((data || []).map((e: any) => e.course_id)));
  }, [user.id]);

  const handleBuy = async (course: any) => {
    if (enrolledIds.includes(course.id)) {
      navigate("/dashboard/courses");
      return;
    }

    if (course.is_free || course.price_inr === 0) {
      setPaying(course.id);
      await supabase.from("payments").insert({ user_id: user.id, course_id: course.id, amount_inr: 0, status: "paid" });
      await supabase.from("enrollments").upsert({ user_id: user.id, course_id: course.id, progress: 0 });
      setEnrolledIds(prev => [...prev, course.id]);
      toast({ title: "Enrolled!", description: `You're now enrolled in ${course.title}` });
      setPaying(null);
      return;
    }

    setPaying(course.id);
    initiatePayment({
      courseId: course.id,
      courseTitle: course.title,
      courseEmoji: course.emoji || "📚",
      amountInr: course.price_inr,
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.full_name || "Student",
      onSuccess: async (paymentId) => {
        await supabase.from("payments").insert({ user_id: user.id, course_id: course.id, amount_inr: course.price_inr, status: "paid" });
        await supabase.from("enrollments").upsert({ user_id: user.id, course_id: course.id, progress: 0 });
        setEnrolledIds(prev => [...prev, course.id]);
        await sendPaymentSuccessEmail(user.email, user.user_metadata?.full_name || "Student", course.title, course.emoji || "📚", course.price_inr, paymentId);
        toast({ title: "🎉 Enrolled!", description: `Payment successful! Check your email for confirmation.` });
        setPaying(null);
      },
      onFailure: (err) => {
        if (!err.includes("cancelled")) toast({ title: "Payment Failed", description: err, variant: "destructive" });
        setPaying(null);
      },
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const totalSpent = payments.reduce((s, p) => s + (p.amount_inr || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-1">Your payment history and available courses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Courses Purchased", value: payments.filter(p => p.amount_inr > 0).length, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Free Enrolled", value: payments.filter(p => p.amount_inr === 0).length, icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment history yet. Enroll in a course below!</p>
          ) : (
            <div className="divide-y divide-border/50">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${p.status === "paid" ? "bg-green-500/10" : "bg-primary/10"}`}>
                      {p.status === "paid"
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <Clock className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.courses?.title || "Course"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.paid_at).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`border text-xs ${p.status === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                      {p.status}
                    </Badge>
                    <span className="font-semibold text-sm">
                      {p.amount_inr === 0 ? <span className="text-muted-foreground">Free</span> : <span className="text-green-500">₹{p.amount_inr}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Courses */}
      <div>
        <h2 className="text-lg font-bold mb-4">Available Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => {
            const enrolled = enrolledIds.includes(course.id);
            const isLoading = paying === course.id;
            return (
              <Card key={course.id} className={`border transition-all hover:border-primary/30 ${enrolled ? "border-green-500/30 bg-green-500/5" : "border-border/50"}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{course.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight">{course.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`border text-xs ${levelColor[course.level] || "bg-muted text-muted-foreground border-border"}`}>
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{course.duration_weeks}w</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold gradient-text text-base">
                      {course.is_free ? "Free" : `₹${course.price_inr}`}
                    </span>
                    <Button size="sm" disabled={isLoading}
                      className={enrolled
                        ? "bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20"
                        : "gradient-primary text-white border-0"}
                      onClick={() => handleBuy(course)}>
                      {isLoading ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : enrolled ? (
                        "Go to Course →"
                      ) : course.is_free ? (
                        "Enroll Free"
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3" /> Buy ₹{course.price_inr}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Payments;
