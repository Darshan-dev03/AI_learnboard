import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "admin@ailearnboard.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin by email — avoids recursive RLS query
      if (data.user.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Not an admin account.");
      }

      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast({ title: "Access Denied", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] gradient-cta flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">AI LearnBoard</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-extrabold text-white leading-tight">Admin<br />Control Panel</h2>
          <p className="text-white/70 text-base">Manage users, courses, payments, and platform analytics from one place.</p>
          <div className="space-y-3 pt-2">
            {["Manage all users & enrollments", "View revenue & payments", "Track course analytics", "Award badges & achievements"].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/40 text-xs">Restricted access · Authorized personnel only</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Admin Sign In</h1>
            <p className="text-muted-foreground text-sm">Enter your admin credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email</label>
              <Input type="email" placeholder="admin@ailearnboard.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-11 bg-muted/40 border-border/60 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 bg-muted/40 border-border/60 rounded-xl pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading}
              className="w-full h-11 gradient-primary text-white border-0 font-semibold rounded-xl">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">Restricted to authorized administrators only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
