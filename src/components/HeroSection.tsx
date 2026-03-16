import { ArrowRight, Play, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-up backdrop-blur-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Smart Learning{" "}
            <span className="gradient-text relative">
              Powered by AI
              <div className="absolute -inset-1 gradient-primary opacity-20 blur-xl -z-10" />
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Experience personalized learning paths, AI-generated quizzes, real-time progress tracking, and smart course recommendations — all tailored to your unique journey.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Track Progress</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Recommendations</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-glow hover:shadow-card-hover hover:scale-105 transition-all duration-300 px-8 group">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 group hover:bg-primary/10 hover:border-primary transition-all duration-300">
              <Play className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
              Explore Courses
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full gradient-primary border-2 border-card flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold">10,000+ Students</p>
              <p className="text-xs text-muted-foreground">Already learning smarter</p>
            </div>
          </div>
        </div>

        <div className="relative animate-slide-in-right">
          <div className="relative z-10 animate-float">
            <div className="relative">
              <img src={heroImage} alt="AI-powered learning dashboard" className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-2xl" />
              {/* Glow effect */}
              <div className="absolute inset-0 gradient-primary opacity-20 rounded-2xl blur-2xl scale-95 animate-pulse" />
            </div>
          </div>
          
          {/* Floating cards */}
          <div className="absolute top-10 -left-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold">AI Powered</p>
                <p className="text-xs text-muted-foreground">Smart Learning</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 -right-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold">98% Success</p>
                <p className="text-xs text-muted-foreground">Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
