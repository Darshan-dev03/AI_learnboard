import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      setProfile(data);
      setLoading(false);
    };
    fetch();
    const sub = supabase.channel("profile_" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        (payload) => setProfile(payload.new))
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [userId]);

  return { profile, loading };
};

export const useEnrollments = (userId: string) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase.from("enrollments")
        .select("*, courses(*)")
        .eq("user_id", userId);
      setEnrollments(data || []);
      setLoading(false);
    };
    fetch();
    const sub = supabase.channel("enrollments_" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments", filter: `user_id=eq.${userId}` },
        () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [userId]);

  return { enrollments, loading };
};

export const useModuleProgress = (userId: string, courseId: string) => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data: mods } = await supabase.from("course_modules")
      .select("*, module_progress(status)")
      .eq("course_id", courseId)
      .order("order_index");

    const mapped = (mods || []).map(m => ({
      ...m,
      status: m.module_progress?.find((p: any) => p.user_id === userId)?.status
        || m.module_progress?.[0]?.status
        || "locked",
    }));

    // Auto-unlock first module if all are locked
    const hasActive = mapped.some(m => m.status === "active" || m.status === "done");
    if (!hasActive && mapped.length > 0) {
      await supabase.from("module_progress").upsert({
        user_id: userId,
        module_id: mapped[0].id,
        status: "active",
      });
      mapped[0].status = "active";
    }

    // Unlock next module after each done
    for (let i = 0; i < mapped.length - 1; i++) {
      if (mapped[i].status === "done" && mapped[i + 1].status === "locked") {
        await supabase.from("module_progress").upsert({
          user_id: userId,
          module_id: mapped[i + 1].id,
          status: "active",
        });
        mapped[i + 1].status = "active";
      }
    }

    setModules(mapped);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId || !courseId) return;
    fetch();
  }, [userId, courseId]);

  return { modules, loading, refetch: fetch };
};

export const useQuiz = () => {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: q } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false }).limit(1).single();
      if (q) {
        setQuiz(q);
        const { data: qs } = await supabase.from("quiz_questions")
          .select("*").eq("quiz_id", q.id).order("order_index");
        setQuestions(qs || []);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { quiz, questions, loading };
};

export const useStudySessions = (userId: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase.from("study_sessions")
        .select("*").eq("user_id", userId)
        .order("study_date", { ascending: false }).limit(7);
      setSessions(data || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { sessions, loading };
};

export const useQuizAttempts = (userId: string) => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { data } = await supabase.from("quiz_attempts")
        .select("*, quizzes(title, topic)").eq("user_id", userId)
        .order("attempted_at", { ascending: false }).limit(7);
      setAttempts(data || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { attempts, loading };
};

export const useStudyPlan = (userId: string) => {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const fetch = async () => {
    const { data } = await supabase.from("study_plan_topics")
      .select("*").eq("user_id", userId).eq("week_start", weekStartStr)
      .order("day_of_week");
    setPlan(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetch();
    const sub = supabase.channel("plan_" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "study_plan_topics", filter: `user_id=eq.${userId}` },
        () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [userId]);

  const toggleTopic = async (id: string, done: boolean) => {
    await supabase.from("study_plan_topics").update({ is_done: done }).eq("id", id);
  };

  return { plan, loading, toggleTopic };
};

export const useAchievements = (userId: string) => {
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const [{ data: badges }, { data: earned }] = await Promise.all([
        supabase.from("badges").select("*"),
        supabase.from("user_badges").select("*, badges(*)").eq("user_id", userId),
      ]);
      setAllBadges(badges || []);
      setUserBadges(earned || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { allBadges, userBadges, loading };
};

export const usePayments = (userId: string) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const [{ data: pays }, { data: sub }] = await Promise.all([
        supabase.from("payments").select("*, courses(title)").eq("user_id", userId).order("paid_at", { ascending: false }),
        supabase.from("subscriptions").select("*").eq("user_id", userId).single(),
      ]);
      setPayments(pays || []);
      setSubscription(sub);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { payments, subscription, loading };
};

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("notifications")
      .select("*").eq("user_id", userId)
      .order("created_at", { ascending: false }).limit(20);
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetch();
    const sub = supabase.channel("notifs_" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [userId]);

  const markAllRead = async () => {
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
    fetch();
  };

  return { notifications, loading, markAllRead };
};

export const useAIChat = (userId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("ai_chat_history")
      .select("*").eq("user_id", userId)
      .order("created_at").limit(50);
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetch();
    const sub = supabase.channel("chat_" + userId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_chat_history", filter: `user_id=eq.${userId}` },
        (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [userId]);

  const saveMessage = async (role: string, message: string) => {
    await supabase.from("ai_chat_history").insert({ user_id: userId, role, message });
  };

  return { messages, loading, saveMessage };
};

export const useCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("courses").select("*").eq("is_published", true).then(({ data }) => {
      setCourses(data || []);
      setLoading(false);
    });
  }, []);

  return { courses, loading };
};

export const useCertificates = (userId: string) => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*, courses(title, emoji)")
      .eq("user_id", userId);
    setCertificates(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetch();
  }, [userId]);

  const issueCertificate = async (userId: string, courseId: string) => {
    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();
    if (existing) return;
    await supabase.from("certificates").insert({ user_id: userId, course_id: courseId });
    fetch();
  };

  return { certificates, loading, issueCertificate };
};
