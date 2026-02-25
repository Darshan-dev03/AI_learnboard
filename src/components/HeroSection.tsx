import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden pt-20">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Smart Learning{" "}
            <span className="gradient-text">Powered by AI</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Experience personalized learning paths, AI-generated quizzes, real-time progress tracking, and smart course recommendations — all tailored to your unique journey.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-glow hover:shadow-card-hover transition-all duration-300 px-8">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 group">
              <Play className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
              Explore Courses
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full gradient-primary border-2 border-card flex items-center justify-center text-xs font-bold text-primary-foreground">
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
            <img src={heroImage} alt="AI-powered learning dashboard" className="w-full max-w-lg mx-auto drop-shadow-2xl" />
          </div>
          <div className="absolute inset-0 gradient-primary opacity-10 rounded-3xl blur-3xl scale-90" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
