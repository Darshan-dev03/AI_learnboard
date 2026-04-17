-- ============================================================
-- AI LearnBoard — Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  skill_level text default 'Beginner',
  daily_goal text default '2 lessons/day',
  study_streak int default 0,
  last_study_date date,
  total_points int default 0,
  notif_new_course boolean default true,
  notif_quiz boolean default true,
  notif_payment boolean default true,
  notif_streak boolean default false,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. COURSES
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  emoji text default '📚',
  description text,
  level text default 'Beginner',
  duration_weeks int,
  price_inr int default 0,
  is_free boolean default false,
  is_published boolean default true,
  created_at timestamptz default now()
);
alter table public.courses enable row level security;
create policy "Anyone can view published courses" on public.courses for select using (is_published = true);

-- 3. COURSE MODULES
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  order_index int not null,
  created_at timestamptz default now()
);
alter table public.course_modules enable row level security;
create policy "Anyone can view modules" on public.course_modules for select using (true);

-- 4. ENROLLMENTS
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  progress int default 0,
  last_lesson text,
  enrolled_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table public.enrollments enable row level security;
create policy "Users can view own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can insert own enrollments" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own enrollments" on public.enrollments for update using (auth.uid() = user_id);

-- 5. MODULE PROGRESS
create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references public.course_modules(id) on delete cascade,
  status text default 'locked', -- locked | active | done
  updated_at timestamptz default now(),
  unique(user_id, module_id)
);
alter table public.module_progress enable row level security;
create policy "Users can manage own module progress" on public.module_progress for all using (auth.uid() = user_id);

-- 6. QUIZZES
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text,
  week_number int,
  time_per_question int default 15,
  created_at timestamptz default now()
);
alter table public.quizzes enable row level security;
create policy "Anyone can view quizzes" on public.quizzes for select using (true);

-- 7. QUIZ QUESTIONS
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null, -- ["opt1","opt2","opt3","opt4"]
  correct_index int not null,
  explanation text,
  order_index int default 0
);
alter table public.quiz_questions enable row level security;
create policy "Anyone can view questions" on public.quiz_questions for select using (true);

-- 8. QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  score int,
  total int,
  answers jsonb,
  attempted_at timestamptz default now()
);
alter table public.quiz_attempts enable row level security;
create policy "Users can manage own attempts" on public.quiz_attempts for all using (auth.uid() = user_id);

-- 9. STUDY SESSIONS (for progress tracking)
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  study_date date default current_date,
  hours_studied numeric(4,2) default 0,
  created_at timestamptz default now(),
  unique(user_id, study_date)
);
alter table public.study_sessions enable row level security;
create policy "Users can manage own sessions" on public.study_sessions for all using (auth.uid() = user_id);

-- 10. STUDY PLANNER
create table if not exists public.study_plan_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  day_of_week text not null,
  topic_name text not null,
  is_done boolean default false,
  week_start date default date_trunc('week', current_date)::date,
  created_at timestamptz default now()
);
alter table public.study_plan_topics enable row level security;
create policy "Users can manage own plan" on public.study_plan_topics for all using (auth.uid() = user_id);

-- 11. ACHIEVEMENTS / BADGES
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  criteria text
);
alter table public.badges enable row level security;
create policy "Anyone can view badges" on public.badges for select using (true);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);
alter table public.user_badges enable row level security;
create policy "Users can view own badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "System can insert badges" on public.user_badges for insert with check (auth.uid() = user_id);

-- 12. PAYMENTS
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id),
  amount_inr int default 0,
  status text default 'paid', -- paid | pending | free
  paid_at timestamptz default now()
);
alter table public.payments enable row level security;
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() = user_id);

-- 13. SUBSCRIPTIONS
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  plan text default 'Basic', -- Basic | Pro | Elite
  renews_at date,
  created_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can upsert own subscription" on public.subscriptions for all using (auth.uid() = user_id);

-- 14. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text, -- quiz | course | achievement | payment
  title text not null,
  description text,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "Users can manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- 15. AI CHAT HISTORY
create table if not exists public.ai_chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role text not null, -- user | ai
  message text not null,
  created_at timestamptz default now()
);
alter table public.ai_chat_history enable row level security;
create policy "Users can manage own chat" on public.ai_chat_history for all using (auth.uid() = user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Courses
insert into public.courses (title, emoji, description, level, duration_weeks, price_inr, is_free) values
  ('HTML & CSS Fundamentals', '🎨', 'Learn the building blocks of the web', 'Beginner', 6, 0, true),
  ('Full Stack Web Development', '🌐', 'Master frontend and backend development', 'Beginner', 16, 1499, false),
  ('DSA with Python', '📊', 'Data Structures and Algorithms using Python', 'Intermediate', 12, 999, false),
  ('Machine Learning Basics', '🤖', 'Introduction to ML concepts and tools', 'Advanced', 10, 1299, false),
  ('React & Next.js Mastery', '⚛️', 'Build modern web apps with React', 'Intermediate', 8, 799, false)
on conflict do nothing;

-- Modules for HTML & CSS
insert into public.course_modules (course_id, title, order_index)
select id, m.title, m.idx from public.courses c
cross join (values
  (1, 'Module 1 – HTML Basics'),
  (2, 'Module 2 – CSS Styling'),
  (3, 'Module 3 – Flexbox & Grid'),
  (4, 'Module 4 – Responsive Design')
) as m(idx, title)
where c.title = 'HTML & CSS Fundamentals'
on conflict do nothing;

-- Modules for Full Stack
insert into public.course_modules (course_id, title, order_index)
select id, m.title, m.idx from public.courses c
cross join (values
  (1, 'Module 1 – HTML'),
  (2, 'Module 2 – CSS'),
  (3, 'Module 3 – JavaScript'),
  (4, 'Module 4 – React'),
  (5, 'Module 5 – Node.js')
) as m(idx, title)
where c.title = 'Full Stack Web Development'
on conflict do nothing;

-- Modules for DSA
insert into public.course_modules (course_id, title, order_index)
select id, m.title, m.idx from public.courses c
cross join (values
  (1, 'Module 1 – Arrays'),
  (2, 'Module 2 – Strings'),
  (3, 'Module 3 – Recursion'),
  (4, 'Module 4 – Trees & Graphs')
) as m(idx, title)
where c.title = 'DSA with Python'
on conflict do nothing;

-- Quiz
insert into public.quizzes (title, topic, week_number, time_per_question) values
  ('Week 1 Quiz', 'Web Development Basics', 1, 15)
on conflict do nothing;

insert into public.quiz_questions (quiz_id, question, options, correct_index, explanation, order_index)
select q.id, qq.question, qq.options::jsonb, qq.correct_index, qq.explanation, qq.order_index
from public.quizzes q
cross join (values
  ('What does HTML stand for?', '["HyperText Markup Language","High Tech Modern Language","HyperText Modern Links","None"]', 0, 'HTML stands for HyperText Markup Language — the standard language for creating web pages.', 1),
  ('Which CSS property controls text size?', '["font-weight","text-size","font-size","text-style"]', 2, 'font-size controls the size of text in CSS.', 2),
  ('How do you declare a variable in JavaScript?', '["variable x = 5","v x = 5","let x = 5","int x = 5"]', 2, 'In modern JavaScript, let or const is used to declare variables.', 3),
  ('Which method adds an element to the end of an array?', '["push()","pop()","shift()","unshift()"]', 0, 'push() adds one or more elements to the end of an array.', 4),
  ('What does CSS stand for?', '["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Colorful Style Sheets"]', 1, 'CSS stands for Cascading Style Sheets.', 5)
) as qq(question, options, correct_index, explanation, order_index)
where q.title = 'Week 1 Quiz'
on conflict do nothing;

-- Badges
insert into public.badges (name, description, icon, criteria) values
  ('First Login', 'Logged in for the first time', '🎯', 'first_login'),
  ('Quick Learner', 'Completed 5 lessons in a day', '⚡', 'lessons_in_day_5'),
  ('7-Day Streak', 'Studied 7 days in a row', '🔥', 'streak_7'),
  ('Quiz Master', 'Score 100% on any quiz', '🧠', 'quiz_perfect'),
  ('Course Finisher', 'Complete your first course', '📚', 'course_complete'),
  ('Top Performer', 'Rank in top 10 on leaderboard', '🏆', 'leaderboard_top10')
on conflict do nothing;

-- 16. CERTIFICATES
-- Run this in your Supabase SQL Editor to add certificate support
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  issued_at timestamptz default now(),
  unique(user_id, course_id)
);
alter table public.certificates enable row level security;
create policy "Users can view own certificates" on public.certificates for select using (auth.uid() = user_id);
create policy "Users can insert own certificates" on public.certificates for insert with check (auth.uid() = user_id);
