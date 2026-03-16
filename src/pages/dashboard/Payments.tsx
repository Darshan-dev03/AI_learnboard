import { CreditCard, Download, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/lib/hooks/useDashboard";

const plans = [
  { name: "Basic", price: "Free", features: ["3 Free Courses", "Weekly Quiz", "Progress Tracking"] },
  { name: "Pro", price: "₹499/mo", features: ["All Courses", "AI Assistant", "Certificates", "Priority Support"] },
  { name: "Elite", price: "₹999/mo", features: ["Everything in Pro", "1-on-1 Mentoring", "Job Placement Help", "Offline Access"] },
];

const Payments = ({ user }: { user: any }) => {
  const { payments, subscription, loading } = usePayments(user.id);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const currentPlan = subscription?.plan || "Basic";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and payment history</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold">{currentPlan} Plan — Active</p>
              {subscription?.renews_at && <p className="text-sm text-muted-foreground">Renews on {new Date(subscription.renews_at).toLocaleDateString()}</p>}
            </div>
          </div>
          <Badge className="gradient-primary text-primary-foreground border-0">
            {plans.find(p => p.name === currentPlan)?.price || "Free"}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(({ name, price, features }) => {
          const isCurrent = name === currentPlan;
          return (
            <Card key={name} className={`border ${isCurrent ? "border-primary/50 bg-primary/5" : "border-border/50"}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{name}</CardTitle>
                  {isCurrent && <Badge className="gradient-primary text-primary-foreground border-0 text-xs">Current</Badge>}
                </div>
                <p className="text-2xl font-bold gradient-text">{price}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${isCurrent ? "gradient-primary text-primary-foreground border-0" : ""}`}
                  variant={isCurrent ? "default" : "outline"} disabled={isCurrent}>
                  {isCurrent ? "Current Plan" : `Upgrade to ${name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment history yet.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.status === "paid" ? "bg-green-500/10" : "bg-primary/10"}`}>
                      {p.status === "paid" ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.courses?.title || "Course"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.paid_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{p.amount_inr === 0 ? "Free" : `₹${p.amount_inr}`}</span>
                    {p.status === "paid" && (
                      <Button size="sm" variant="ghost" className="gap-1 text-xs h-7">
                        <Download className="w-3 h-3" /> Invoice
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
