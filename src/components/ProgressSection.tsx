import { Brain, TrendingUp, Target, Lightbulb } from "lucide-react";

const progressBars = [
  { label: "Data Structures", value: 78, color: "from-secondary to-primary" },
  { label: "Algorithms", value: 65, color: "from-primary to-accent" },
  { label: "Web Development", value: 92, color: "from-accent to-secondary" },
  { label: "System Design", value: 45, color: "from-secondary to-accent" },
];

const weeklyData = [30, 45, 60, 55, 75, 85, 70];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ProgressSection = () => (
  <section id="dashboard" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Track Your Progress</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">AI-powered analytics that help you understand your strengths and improve your weak areas.</p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Progress Bars */}
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-card border border-border p-6 space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Subject Progress
          </h3>
          {progressBars.map((bar) => (
            <div key={bar.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{bar.label}</span>
                <span className="text-muted-foreground">{bar.value}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color} animate-progress-fill`}
                  style={{ "--progress-width": `${bar.value}%`, width: `${bar.value}%` } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Card */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-accent" /> AI Insights
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
                <Lightbulb className="w-4 h-4 text-primary inline mr-2" />
                You're improving in <span className="font-semibold text-primary">DSA</span> — focus more on Recursion.
              </div>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-sm">
                <TrendingUp className="w-4 h-4 text-accent inline mr-2" />
                <span className="font-semibold text-accent">92%</span> accuracy in Web Dev this week!
              </div>
            </div>
          </div>

          {/* Weekly Graph */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-semibold mb-4">Weekly Activity</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-md gradient-primary transition-all duration-500"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProgressSection;
