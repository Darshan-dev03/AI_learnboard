import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Home, BookOpen, MessageSquare, ClipboardList, BarChart2,
  CreditCard, Calendar, Trophy, Settings, Bell, Menu, X, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "My Courses", icon: BookOpen, path: "/dashboard/courses" },
  { label: "AI Assistant", icon: MessageSquare, path: "/dashboard/ai-assistant" },
  { label: "Weekly Quiz", icon: ClipboardList, path: "/dashboard/quiz" },
  { label: "Progress", icon: BarChart2, path: "/dashboard/progress" },
  { label: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Study Planner", icon: Calendar, path: "/dashboard/planner" },
  { label: "Achievements", icon: Trophy, path: "/dashboard/achievements" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const DashboardLayout = ({ children, user }: { children: React.ReactNode; user: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you soon!" });
    navigate("/");
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold gradient-text">LearnBoard</span>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
            {(user?.user_metadata?.full_name || user?.email || "S")[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.user_metadata?.full_name || "Student"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${active ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link to="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {(user?.user_metadata?.full_name || user?.email || "S")[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
