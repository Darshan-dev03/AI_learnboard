import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/lib/hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const ProfileSettings = ({ user }: { user: any }) => {
  const { profile, loading } = useProfile(user.id);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) setName(profile.full_name || "");
  }, [profile]);

  const saveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: "Profile updated successfully." });
    setSavingProfile(false);
  };

  const savePassword = async () => {
    if (!newPassword || !currentPassword) {
      toast({ title: "Error", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords don't match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setSavingPassword(true);

    // Re-authenticate with current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      toast({ title: "Error", description: "Current password is incorrect.", variant: "destructive" });
      setSavingPassword(false);
      return;
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "Please log in with your new password." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate("/login");
    }
    setSavingPassword(false);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <Card className="border-border/50">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {(name || user?.email || "S")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{name || "Student"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email} disabled className="bg-muted/50 opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <Button onClick={saveProfile} disabled={savingProfile}
            className="gradient-primary text-white border-0">
            {savingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input type={showCurrent ? "text" : "password"} value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" className="bg-muted/50 pr-10" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)" className="bg-muted/50 pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input type={showConfirm ? "text" : "password"} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password" className="bg-muted/50 pr-10" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-600">
            After changing your password, you'll be signed out and redirected to login.
          </div>

          <Button onClick={savePassword}
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="gradient-primary text-white border-0">
            {savingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
