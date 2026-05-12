import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, IndianRupee, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    // Fetch payments — join profiles and courses separately to avoid RLS join issues
    const { data: payData, error: payErr } = await supabase
      .from("payments")
      .select("id, user_id, course_id, amount_inr, status, paid_at")
      .order("paid_at", { ascending: false });

    if (payErr) {
      console.error("AdminPayments error:", payErr);
      setError(`Failed to load payments: ${payErr.message}`);
      setLoading(false);
      return;
    }

    // Enrich with profile names and course titles
    const enriched = await Promise.all((payData || []).map(async (p) => {
      const [{ data: profile }, { data: course }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", p.user_id).maybeSingle(),
        supabase.from("courses").select("title, emoji").eq("id", p.course_id).maybeSingle(),
      ]);
      return { ...p, profile, course };
    }));

    setPayments(enriched);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = payments.reduce((s, p) => s + (p.amount_inr || 0), 0);
  const paidCount = payments.filter(p => p.status === "paid" && p.amount_inr > 0).length;
  const freeCount = payments.filter(p => p.amount_inr === 0).length;

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">{payments.length} total transactions</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error loading payments</p>
            <p className="text-xs mt-0.5 opacity-80">{error}</p>
            <p className="text-xs mt-1 opacity-60">Run the RLS fix SQL in Supabase SQL Editor.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Paid Enrollments", value: paidCount, icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Free Enrollments", value: freeCount, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {["Student", "Course", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      {error ? "Fix the error above to see payments." : "No transactions yet."}
                    </td>
                  </tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(p.profile?.full_name || "U")[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{p.profile?.full_name || "Student"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.course?.emoji} {p.course?.title || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {p.amount_inr === 0
                        ? <span className="text-muted-foreground">Free</span>
                        : <span className="text-green-500">₹{p.amount_inr}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`border text-xs ${p.status === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.paid_at).toLocaleDateString("en-IN")}
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

export default AdminPayments;
