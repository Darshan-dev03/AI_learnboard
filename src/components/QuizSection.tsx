import { Brain, Zap, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const quizzes = [
  {
    title: "DSA Weekly Challenge",
    questions: 15,
    difficulty: "Adaptive",
    time: "30 min",
    score: "85/100",
    topics: ["Arrays", "Linked Lists", "Recursion"],
  },
  {
    title: "React Fundamentals",
    questions: 10,
    difficulty: "Intermediate",
    time: "20 min",
    score: "92/100",
    topics: ["Hooks", "State", "Components"],
  },
  {
    title: "Python Essentials",
    questions: 12,
    difficulty: "Beginner",
    time: "25 min",
    score: null,
    topics: ["OOP", "Functions", "Lists"],
  },
];

const difficultyColor: Record<string, string> = {
  Adaptive: "gradient-primary text-primary-foreground",
  Intermediate: "bg-amber-100 text-amber-700",
  Beginner: "bg-emerald-100 text-emerald-700",
};

const QuizSection = () => (
  <section id="quiz" className="py-24 gradient-hero">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Weekly AI-Based Quizzes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take AI-generated quizzes that adapt to your learning level. Get instant feedback and track your improvement.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {quizzes.map((quiz) => (
          <div key={quiz.title} className="bg-card rounded-2xl shadow-card border border-border p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor[quiz.difficulty]}`}>
                {quiz.difficulty}
              </span>
            </div>

            <h3 className="font-semibold text-lg">{quiz.title}</h3>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {quiz.questions} Qs
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {quiz.time}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quiz.topics.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
              ))}
            </div>

            {quiz.score ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">Score: {quiz.score}</p>
                  <p className="text-xs text-emerald-600">Completed</p>
                </div>
              </div>
            ) : (
              <Button className="w-full gradient-primary text-primary-foreground border-0">
                <BarChart3 className="w-4 h-4 mr-2" /> Start Quiz
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default QuizSection;
