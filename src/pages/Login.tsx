import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@ailearnboard.com";

const Login = () => {
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

      // Role-based redirect
      if (data.user.email === ADMIN_EMAIL) {
        sessionStorage.setItem("admin_auth", "true");
        toast({ title: "Welcome, Admin!", description: "Redirecting to admin dashboard..." });
        navigate("/admin/dashboard");
      } else {
        toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isAdminEmail = email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden gradient-cta flex-col justify-between p-14">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">AI LearnBoard</span>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Learning Platform
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Learn Smarter.<br />Grow Faster.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Join with learners accelerating their careers with personalized AI-driven education.
          </p>
        </div>

        <div className="relative z-10 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
          <p className="text-white/70 text-sm">Start your learning journey today with AI-powered personalized courses.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-background">
        {/* Back to home - prominent button */}
        <div className="w-full max-w-[380px] mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 border-border/60 hover:border-primary hover:bg-primary/5 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">AI LearnBoard</span>
        </div>

        <div className="w-full max-w-[380px] space-y-8">
          <div className="space-y-1.5">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Sign in</h2>
            <p className="text-muted-foreground text-sm">Welcome back — let's pick up where you left off.</p>
          </div>

          {/* Role indicator */}
          {isAdminEmail && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Admin account detected — will redirect to Admin Dashboard
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 bg-muted/40 border-border/60 focus:border-primary rounded-xl text-sm transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 bg-muted/40 border-border/60 focus:border-primary rounded-xl text-sm transition-colors pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 ${isAdminEmail ? "bg-amber-500 hover:bg-amber-600 shadow-none" : "gradient-primary"}`}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {isAdminEmail ? <ShieldCheck className="w-4 h-4" /> : null}
                  {isAdminEmail ? "Sign In as Admin" : "Sign In"}
                  {!isAdminEmail && <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground">New here?</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <Link to="/signup"
            className="flex items-center justify-center w-full h-12 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200">
            Create a free account →
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <span className="text-primary cursor-pointer hover:underline">Terms</span> &{" "}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
