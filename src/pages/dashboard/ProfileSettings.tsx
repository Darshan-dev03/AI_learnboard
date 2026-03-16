import { useState, useEffect } from "react";
import { User, Lock, Bell, BookOpen, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/hooks/useDashboard";

const ProfileSettings = ({ user }: { user: any }) => {
  const { profile, loading } = useProfile(user.id);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) setName(profile.full_name || "");
  }, [profile]);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: name, skill_level: profile?.skill_level, daily_goal: profile?.daily_goal }).eq("id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: "Profile updated." });
    setSaving(false);
  };

  const savePassword = async () => {
    if (!newPassword) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated!" }); setNewPassword(""); }
    setSaving(false);
  };

  const saveNotifications = async (key: string, value: boolean) => {
    await supabase.from("profiles").update({ [`notif_${key}`]: value }).eq("id", user.id);
  };

  const savePreferences = async (field: string, value: string) => {
    await supabase.from("profiles").update({ [field]: value }).eq("id", user.id);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
            {(name || user?.email || "S")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{name || "Student"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} disabled className="bg-muted/50 opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
          </div>
          <Button onClick={saveProfile} disabled={saving} className="gradient-primary text-primary-foreground border-0">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={newPassword}
                onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className="bg-muted/50 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button onClick={savePassword} disabled={saving || !newPassword} className="gradient-primary text-primary-foreground border-0">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "new_course", label: "New course available", field: "notif_new_course" },
            { key: "quiz", label: "Weekly quiz released", field: "notif_quiz" },
            { key: "payment", label: "Payment updates", field: "notif_payment" },
            { key: "streak", label: "Study streak reminders", field: "notif_streak" },
          ].map(({ key, label, field }) => {
            const val = profile?.[field] ?? true;
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <button onClick={() => saveNotifications(key, !val)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${val ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Learning Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Level</Label>
            <select value={profile?.skill_level || "Beginner"} onChange={e => savePreferences("skill_level", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-muted/50 text-sm">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Daily Goal</Label>
            <select value={profile?.daily_goal || "2 lessons/day"} onChange={e => savePreferences("daily_goal", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-muted/50 text-sm">
              <option>1 lesson/day</option><option>2 lessons/day</option><option>3 lessons/day</option><option>5 lessons/day</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
