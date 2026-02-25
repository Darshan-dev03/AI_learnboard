import { UserPlus, BookOpen, CreditCard, GraduationCap, Brain, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "Sign Up", description: "Create your free account in seconds" },
  { icon: BookOpen, label: "Choose Course", description: "Browse AI-recommended courses" },
  { icon: CreditCard, label: "Pay Securely", description: "Simple and secure checkout" },
  { icon: GraduationCap, label: "Learn", description: "Access video lessons and notes" },
  { icon: Brain, label: "Take AI Quiz", description: "Adaptive quizzes to test knowledge" },
  { icon: BarChart3, label: "Track Progress", description: "Analytics to guide your journey" },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Six simple steps to transform your learning experience.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map(({ icon: Icon, label, description }, i) => (
          <div key={label} className="relative group">
            <div className="bg-card rounded-2xl shadow-card border border-border p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-glow group-hover:animate-pulse-glow transition-all">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold text-primary/60">Step {i + 1}</div>
              <h3 className="font-semibold text-lg">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {i < steps.length - 1 && i % 3 !== 2 && (
              <ArrowRight className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
