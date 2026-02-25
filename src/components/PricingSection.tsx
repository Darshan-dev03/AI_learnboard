import { Check, Shield, Zap, Receipt, RotateCcw, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["3 Free Courses", "Basic AI Quizzes", "Progress Tracking", "Community Access"],
    highlighted: false,
  },
  {
    name: "Monthly",
    price: "₹499",
    period: "/month",
    description: "Most popular for students",
    features: ["All Courses Unlocked", "Advanced AI Quizzes", "Detailed Analytics", "Priority Support", "Certificate of Completion"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "₹2,999",
    period: "/year",
    description: "Best value for serious learners",
    features: ["Everything in Monthly", "1-on-1 AI Mentoring", "Resume Builder", "Placement Assistance", "Lifetime Access"],
    highlighted: false,
  },
];

const trustIcons = [
  { icon: Shield, label: "Secure Payment" },
  { icon: Zap, label: "Instant Access" },
  { icon: Receipt, label: "Invoice" },
  { icon: RotateCcw, label: "7-Day Refund" },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 gradient-hero">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Choose a plan that fits your learning goals. Upgrade or cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
              plan.highlighted
                ? "gradient-primary text-primary-foreground shadow-glow scale-105"
                : "bg-card shadow-card border border-border"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-card text-primary text-xs font-bold rounded-full shadow-card">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className={`text-sm mt-1 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {plan.description}
            </p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.period}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                plan.highlighted
                  ? "bg-card text-primary hover:bg-card/90"
                  : "gradient-primary text-primary-foreground border-0"
              }`}
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-8">
        {trustIcons.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="w-5 h-5 text-primary" />
            {label}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 text-muted-foreground">
        <CreditCard className="w-8 h-8" />
        <Smartphone className="w-8 h-8" />
        <Wallet className="w-8 h-8" />
      </div>
    </div>
  </section>
);

export default PricingSection;
