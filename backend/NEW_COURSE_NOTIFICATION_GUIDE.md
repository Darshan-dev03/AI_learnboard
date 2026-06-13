# 🎓 New Course Notification System

## Overview
Automatically notifies all users when a new course is added to AI LearnBoard.

---

## How It Works

### 1. **Database Trigger** 
When a new course is inserted into the `courses` table:
- ✅ A database trigger automatically fires
- ✅ Creates a notification for **every user** who has `notif_new_course = true`
- ✅ Notification appears in the user's notification page
- ✅ Real-time update via Supabase subscriptions

### 2. **Notification Details**
```json
{
  "type": "course",
  "title": "🎓 New Course Available!",
  "description": "Check out the new course: 🎨 HTML & CSS Fundamentals",
  "is_read": false
}
```

---

## Setup Instructions

### Step 1: Run the SQL Trigger
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `trigger_new_course_notification.sql`
3. Copy and run the entire SQL script
4. Verify: You should see "Success" message

### Step 2: Test the Trigger
Run this test query in Supabase SQL Editor:
```sql
-- Add a test course
INSERT INTO public.courses (title, emoji, description, level, duration_weeks, price_inr, is_free, is_published)
VALUES ('React Native Mastery', '📱', 'Build mobile apps with React Native', 'Intermediate', 8, 899, false, true);

-- Check notifications were created
SELECT * FROM public.notifications 
WHERE title LIKE '%New Course%' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 3: Verify in the App
1. Add a new course through Supabase dashboard
2. Login to any user account
3. Go to **Dashboard** → **Notifications**
4. You should see the new course notification! 🎉

---

## User Preferences

Users can control whether they receive new course notifications:

### Database Column: `profiles.notif_new_course`
- `true` (default) - Receive notifications
- `false` - Don't receive notifications

### Future: Add UI Toggle
You can add a settings page where users can toggle this:
```typescript
await supabase
  .from('profiles')
  .update({ notif_new_course: false })
  .eq('id', userId);
```

---

## Advanced Features

### Manual Notification Function
If you want to notify users about an **existing course**:

```sql
-- Notify all users about a specific course
SELECT notify_users_about_course('course-uuid-here');
```

This returns the number of notifications created.

---

## How to Add a New Course

### Method 1: Through Supabase Dashboard (Recommended)
1. Go to **Supabase** → **Table Editor** → **courses**
2. Click **Insert row**
3. Fill in:
   - `title`: Course name
   - `emoji`: Course icon (e.g., 🎨)
   - `description`: Course description
   - `level`: Beginner/Intermediate/Advanced
   - `duration_weeks`: Number of weeks
   - `price_inr`: Price in rupees (0 for free)
   - `is_free`: true/false
   - `is_published`: **true** (must be true for notifications)
4. Click **Save**
5. ✅ Notifications automatically created for all users!

### Method 2: Through SQL
```sql
INSERT INTO public.courses (
  title, 
  emoji, 
  description, 
  level, 
  duration_weeks, 
  price_inr, 
  is_free, 
  is_published
)
VALUES (
  'MongoDB Essentials',
  '🗃️',
  'Learn NoSQL database design and queries',
  'Intermediate',
  6,
  799,
  false,
  true  -- Must be true for notifications
);
```

### Method 3: Future - Admin Panel
You can build an admin UI with a form to add courses:
```typescript
const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'New Course',
    emoji: '📚',
    description: 'Course description',
    level: 'Beginner',
    duration_weeks: 4,
    price_inr: 0,
    is_free: true,
    is_published: true
  });
// Trigger automatically fires and creates notifications!
```

---

## Troubleshooting

### Notifications not appearing?

**Check 1: Is the trigger installed?**
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_new_course_notify_users';
```

**Check 2: Is the course published?**
```sql
SELECT id, title, is_published FROM courses ORDER BY created_at DESC LIMIT 5;
```
Only courses with `is_published = true` create notifications.

**Check 3: Do users have notifications enabled?**
```sql
SELECT id, full_name, notif_new_course FROM profiles LIMIT 10;
```

**Check 4: Check notification table**
```sql
SELECT * FROM notifications 
WHERE type = 'course' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Technical Details

### Database Schema

**Notifications Table:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT,  -- 'course', 'quiz', 'achievement', 'payment'
  title TEXT,
  description TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Profiles Table:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  notif_new_course BOOLEAN DEFAULT true,  -- Control notifications
  notif_quiz BOOLEAN DEFAULT true,
  notif_payment BOOLEAN DEFAULT true,
  notif_streak BOOLEAN DEFAULT false
);
```

### Frontend Hook
```typescript
// In useDashboard.ts
export const useNotifications = (userId: string) => {
  // Fetches notifications with real-time subscriptions
  // Automatically updates when new notifications are added
};
```

---

## Notification Flow

```
1. Admin adds new course
   ↓
2. Database INSERT trigger fires
   ↓
3. notify_users_new_course() function executes
   ↓
4. For each user with notif_new_course = true:
   - Creates notification record
   ↓
5. Supabase real-time subscription pushes update
   ↓
6. User's notification page updates instantly
   ↓
7. User sees notification with unread badge 🔵
```

---

## Success Checklist

✅ SQL trigger installed in Supabase
✅ Test course added and notifications created
✅ Notifications visible in user dashboard
✅ Real-time updates working
✅ Unread badge showing correctly
✅ Mark as read functionality working

---

## Next Steps

### Enhance the System:
1. **Email notifications** - Send email when new course is added
2. **Push notifications** - Browser push notifications
3. **Admin UI** - Build course creation form in admin panel
4. **Notification preferences** - Let users customize notification types
5. **Notification categories** - Filter by type (course, quiz, etc.)
6. **Notification analytics** - Track notification engagement

---

## Support

If you encounter any issues:
1. Check Supabase logs
2. Verify trigger is installed
3. Test with SQL queries
4. Check user notification preferences
5. Verify real-time subscription is active

---

**🎉 Your notification system is now fully automated!**

Every time you add a new course, all users will be notified automatically.
