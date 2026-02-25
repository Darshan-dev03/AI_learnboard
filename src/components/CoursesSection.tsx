import { Star, Clock, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const courses = [
  { title: "Data Structures & Algorithms", level: "Intermediate", duration: "12 weeks", rating: 4.8, price: "₹999", image: "📊", aiRecommended: true },
  { title: "Full Stack Web Development", level: "Beginner", duration: "16 weeks", rating: 4.9, price: "₹1,499", image: "🌐", aiRecommended: true },
  { title: "Machine Learning with Python", level: "Advanced", duration: "10 weeks", rating: 4.7, price: "₹1,299", image: "🤖", aiRecommended: false },
  { title: "React & Next.js Mastery", level: "Intermediate", duration: "8 weeks", rating: 4.8, price: "₹799", image: "⚛️", aiRecommended: false },
  { title: "System Design Fundamentals", level: "Advanced", duration: "6 weeks", rating: 4.6, price: "₹1,199", image: "🏗️", aiRecommended: true },
  { title: "Python for Beginners", level: "Beginner", duration: "4 weeks", rating: 4.9, price: "Free", image: "🐍", aiRecommended: false },
];

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const CoursesSection = () => (
  <section id="courses" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <Badge variant="secondary" className="gradient-primary text-primary-foreground border-0 px-4 py-1">
          <Sparkles className="w-3 h-3 mr-1" /> AI-Curated
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold">Explore Our Courses</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Handpicked and AI-recommended courses designed to accelerate your learning journey.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <div
            key={course.title}
            className="group bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border hover:-translate-y-1"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-40 gradient-hero flex items-center justify-center text-6xl relative">
              {course.image}
              {course.aiRecommended && (
                <Badge className="absolute top-3 right-3 gradient-primary text-primary-foreground border-0 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Recommended
                </Badge>
              )}
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor[course.level]}`}>
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{course.rating}</span>
                </span>
                <span className="font-bold text-lg gradient-text">{course.price}</span>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0 mt-2">
                Enroll Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoursesSection;
