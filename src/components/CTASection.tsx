import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-24 gradient-primary relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-20 w-32 h-32 border border-primary-foreground/20 rounded-full" />
      <div className="absolute bottom-10 right-20 w-48 h-48 border border-primary-foreground/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-foreground/10 rounded-full" />
    </div>

    <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
      <Sparkles className="w-10 h-10 text-primary-foreground/80 mx-auto" />
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground max-w-3xl mx-auto leading-tight">
        Ready to Transform Your Learning Journey?
      </h2>
      <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
        Join thousands of students who are already learning smarter with AI. Start for free today.
      </p>
      <Link to="/login">
        <Button
          size="lg"
          className="bg-card text-primary hover:bg-card/90 px-10 py-6 text-lg font-semibold animate-pulse-glow transition-all duration-300"
        >
          Start Learning Now
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Link>
    </div>
  </section>
);

export default CTASection;
