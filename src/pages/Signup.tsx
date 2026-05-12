import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Eye, EyeOff, Sparkles, BookOpen, Trophy, Zap, CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const features = [
  { icon: BookOpen, text: "Access AI-curated courses" },
  { icon: Trophy, text: "Track achievements & progress" },
  { icon: Zap, text: "Personalized learning paths" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match!", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create account.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Email confirmation screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground text-sm">We sent a confirmation link to</p>
            <p className="font-semibold text-foreground">{email}</p>
            <p className="text-muted-foreground text-sm mt-2">
              Click the link in the email to activate your account, then come back to log in.
            </p>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl text-xs text-muted-foreground">
            Didn't receive it? Check your spam or junk folder.
          </div>
          <Link to="/login">
            <Button className="w-full gradient-primary text-white border-0 font-semibold">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-cta flex-col justify-between p-12">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">AI LearnBoard</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Start for free today</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your learning<br />journey starts here.
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Create your account and get instant access to AI-powered courses tailored just for you.
            </p>
          </div>
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/20 pt-6">
          <p className="text-white/60 text-sm italic">"An investment in knowledge pays the best interest."</p>
          <p className="text-white/40 text-xs mt-1">— Benjamin Franklin</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-background overflow-y-auto">

        {/* Back to home - prominent button */}
        <div className="w-full max-w-sm mb-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 border-border/60 hover:border-primary hover:bg-primary/5 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">AI LearnBoard</span>
        </div>

        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground text-sm">Join thousands of learners today — it's free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={name}
                onChange={e => setName(e.target.value)}
                className="h-11 bg-muted/40 border-border/60 focus:border-primary transition-colors" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-11 bg-muted/40 border-border/60 focus:border-primary transition-colors" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="h-11 bg-muted/40 border-border/60 focus:border-primary transition-colors pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`h-11 bg-muted/40 border-border/60 focus:border-primary transition-colors pr-10 ${confirmPassword.length > 0 && !passwordMatch ? "border-destructive" : ""}`}
                  required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {passwordMatch && <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
              </div>
              {confirmPassword.length > 0 && !passwordMatch && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 gradient-primary text-white border-0 font-semibold shadow-glow hover:opacity-90 transition-opacity mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-3">
              Already have an account?
            </div>
          </div>

          <Link to="/login" className="flex items-center justify-center w-full h-11 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200">
            Sign in instead →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
