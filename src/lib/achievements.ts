import { supabase } from "@/lib/supabase";

export const awardBadge = async (
  userId: string,
  criteria: string,
  toast: (opts: any) => void
) => {
  try {
    const { data: badge } = await supabase
      .from("badges").select("id, name, icon").eq("criteria", criteria).maybeSingle();
    if (!badge) return;

    const { data: existing } = await supabase
      .from("user_badges").select("id")
      .eq("user_id", userId).eq("badge_id", badge.id).maybeSingle();
    if (existing) return;

    await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id });
    toast({
      title: `${badge.icon} Achievement Unlocked!`,
      description: `You earned the "${badge.name}" badge!`,
    });
  } catch (e) {
    console.warn("awardBadge failed:", e);
  }
};

export const addPoints = async (userId: string, points: number) => {
  try {
    const { data: profile } = await supabase
      .from("profiles").select("total_points").eq("id", userId).single();
    const current = profile?.total_points || 0;
    await supabase.from("profiles")
      .update({ total_points: current + points }).eq("id", userId);
  } catch (e) {
    console.warn("addPoints failed:", e);
  }
};

// Update streak: call once per dashboard visit
// Increments if user visited yesterday, resets if they missed a day, no-op if already counted today
export const updateStreak = async (userId: string): Promise<number> => {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("study_streak, last_study_date")
      .eq("id", userId)
      .single();

    const today = new Date().toISOString().split("T")[0];
    const lastDate = profile?.last_study_date;
    const currentStreak = profile?.study_streak || 0;

    // Already counted today — no change
    if (lastDate === today) return currentStreak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak: number;
    if (lastDate === yesterdayStr) {
      // Visited yesterday — continue streak
      newStreak = currentStreak + 1;
    } else {
      // Missed a day or first visit — reset to 1
      newStreak = 1;
    }

    await supabase.from("profiles").update({
      study_streak: newStreak,
      last_study_date: today,
    }).eq("id", userId);

    return newStreak;
  } catch (e) {
    console.warn("updateStreak failed:", e);
    return 0;
  }
};

// Auto-check and award all badges based on current user state
export const checkAndAwardBadges = async (
  userId: string,
  toast: (opts: any) => void
) => {
  try {
    // Update streak first, then check badges with fresh streak value
    const streak = await updateStreak(userId);

    const [
      { data: enrollments },
      { data: attempts },
      { data: leaderboard },
    ] = await Promise.all([
      supabase.from("enrollments").select("progress").eq("user_id", userId),
      supabase.from("quiz_attempts").select("score, total").eq("user_id", userId),
      supabase.from("profiles").select("id").order("total_points", { ascending: false }).limit(10),
    ]);

    // 1. First Login — always award on first check
    await awardBadge(userId, "first_login", toast);

    // 2. Course Finisher — completed at least 1 course
    if ((enrollments || []).some(e => e.progress === 100)) {
      await awardBadge(userId, "course_complete", toast);
    }

    // 3. Quiz Master — scored 100% on any quiz
    if ((attempts || []).some(a => a.score === a.total && a.total > 0)) {
      await awardBadge(userId, "quiz_perfect", toast);
    }

    // 4. Quick Learner — 5+ quiz attempts
    if ((attempts || []).length >= 5) {
      await awardBadge(userId, "lessons_in_day_5", toast);
    }

    // 5. 7-Day Streak — streak reached 7
    if (streak >= 7) {
      await awardBadge(userId, "streak_7", toast);
    }

    // 6. Top Performer — in top 10 leaderboard
    const top10Ids = (leaderboard || []).map((p: any) => p.id);
    if (top10Ids.includes(userId)) {
      await awardBadge(userId, "leaderboard_top10", toast);
    }
  } catch (e) {
    console.warn("checkAndAwardBadges failed:", e);
  }
};
