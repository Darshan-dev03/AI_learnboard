import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, CreditCard, Trophy, BarChart2, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Achievements", icon: Trophy, path: "/admin/achievements" },
  { label: "Analytics", icon: BarChart2, path: "/admin/analytics" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check sessionStorage — avoids recursive RLS query
    if (!sessionStorage.getItem("admin_auth")) navigate("/admin");
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("admin_auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-card border-r border-border fixed inset-y-0 z-30">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Admin Portal</p>
            <p className="text-xs text-muted-foreground">AI LearnBoard</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active ? "gradient-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center justify-between">
          <p className="text-sm font-medium">
            {navItems.find(n => n.path === location.pathname)?.label || "Admin"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            admin@ailearnboard.com
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
