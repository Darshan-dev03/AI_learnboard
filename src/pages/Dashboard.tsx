import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import MyCourses from "./dashboard/MyCourses";
import AIAssistant from "./dashboard/AIAssistant";
import WeeklyQuiz from "./dashboard/WeeklyQuiz";
import Progress from "./dashboard/Progress";
import Payments from "./dashboard/Payments";
import StudyPlanner from "./dashboard/StudyPlanner";
import Achievements from "./dashboard/Achievements";
import ProfileSettings from "./dashboard/ProfileSettings";
import Notifications from "./dashboard/Notifications";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate("/login"); return; }
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout user={user}>
      <Routes>
        <Route index element={<DashboardHome user={user} />} />
        <Route path="courses" element={<MyCourses user={user} />} />
        <Route path="ai-assistant" element={<AIAssistant user={user} />} />
        <Route path="quiz" element={<WeeklyQuiz user={user} />} />
        <Route path="progress" element={<Progress user={user} />} />
        <Route path="payments" element={<Payments user={user} />} />
        <Route path="planner" element={<StudyPlanner user={user} />} />
        <Route path="achievements" element={<Achievements user={user} />} />
        <Route path="settings" element={<ProfileSettings user={user} />} />
        <Route path="notifications" element={<Notifications user={user} />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
