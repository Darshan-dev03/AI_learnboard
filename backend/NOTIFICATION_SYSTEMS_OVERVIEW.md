# Notification Systems Overview

## All Notification Types in AI LearnBoard

The platform has multiple automated notification systems to keep users informed about important events.

---

## 1. 🎓 New Course Notifications

**Trigger**: When a new course is added to the platform
**Recipients**: All users who have `notif_new_course` enabled
**Message**: "🎓 New Course Available! Check out the new course: [emoji] [course title]"

**Files**:
- `trigger_new_course_notification.sql`
- `NEW_COURSE_NOTIFICATION_GUIDE.md`

**Example**:
```sql
INSERT INTO courses (title, emoji, description, level, is_published)
VALUES ('Advanced React', '⚛️', 'Master React patterns', 'Advanced', true);
-- All users with notif_new_course=true will be notified
```

---

## 2. 💳 Payment & Purchase Notifications

**Trigger**: When a user makes a payment or enrolls in a course
**Recipients**: The user who made the payment (if `notif_payment` enabled)
**Messages**:
- Free: "🎉 Course Enrolled Successfully!"
- Paid: "✅ Payment Successful! Payment of ₹[amount] received"
- Pending: "⏳ Payment Pending - being processed"
- Confirmed: "✅ Payment Confirmed! You can now access all content"

**Files**:
- `trigger_payment_notification.sql`
- `PAYMENT_NOTIFICATION_GUIDE.md`

**Example**:
```sql
INSERT INTO payments (user_id, course_id, amount_inr, status)
VALUES ('user-id', 'course-id', 1499, 'paid');
-- User receives payment success notification
```

---

## 3. 📝 Quiz Notifications

**Trigger**: Manual - when admin creates/assigns quizzes
**Recipients**: Users based on notification preferences
**Setting**: `notif_quiz` in profiles table

**Integration**: Can be added through frontend when creating quizzes

---

## 4. 🔥 Streak Notifications

**Trigger**: Manual - when user maintains study streak
**Recipients**: Users based on notification preferences
**Setting**: `notif_streak` in profiles table

**Integration**: Can be triggered when updating study sessions

---

## Notification Preferences

Users can control which notifications they receive in their profile settings:

```typescript
// Profile notification settings
profiles {
  notif_new_course: boolean  // Default: true
  notif_quiz: boolean        // Default: true  
  notif_payment: boolean     // Default: true
  notif_streak: boolean      // Default: false
}
```

---

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text,                    -- 'quiz' | 'course' | 'achievement' | 'payment'
  title text NOT NULL,
  description text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)
```sql
-- Users can only see and manage their own notifications
CREATE POLICY "Users can manage own notifications" 
ON notifications FOR ALL 
USING (auth.uid() = user_id);
```

---

## Frontend Integration

### Notification Display
The `DashboardLayout.tsx` component includes a notification dropdown in the navbar that:
- Shows unread notification count badge
- Lists all notifications with read/unread status
- Allows marking individual notifications as read
- Allows marking all as read
- Auto-refreshes every 30 seconds

### Usage in Components
```typescript
import { supabase } from '@/lib/supabase';

// Fetch notifications
const { data: notifications } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Mark as read
await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId);
```

---

## How to Add New Notification Types

### Step 1: Create Trigger Function
```sql
CREATE OR REPLACE FUNCTION notify_users_custom_event()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO notifications (user_id, type, title, description)
  SELECT 
    user_id,
    'custom_type',
    'Custom Title',
    'Custom description'
  FROM profiles
  WHERE custom_preference = true;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 2: Create Trigger
```sql
CREATE TRIGGER on_custom_event
  AFTER INSERT ON some_table
  FOR EACH ROW
  EXECUTE FUNCTION notify_users_custom_event();
```

### Step 3: Add User Preference
```sql
ALTER TABLE profiles 
ADD COLUMN notif_custom_type boolean DEFAULT true;
```

### Step 4: Update Frontend Settings
Add the new preference to user settings page

---

## Testing Notifications

### Manual Notification Insert
```sql
INSERT INTO notifications (user_id, type, title, description)
VALUES (
  'user-uuid',
  'achievement',
  '🏆 New Badge Earned!',
  'Congratulations! You earned the Quick Learner badge.'
);
```

### View All Notifications
```sql
SELECT 
  n.*,
  p.full_name
FROM notifications n
JOIN profiles p ON n.user_id = p.id
ORDER BY n.created_at DESC
LIMIT 20;
```

### View Unread Count by User
```sql
SELECT 
  user_id,
  COUNT(*) as unread_count
FROM notifications
WHERE is_read = false
GROUP BY user_id
ORDER BY unread_count DESC;
```

---

## Monitoring & Analytics

### Notification Delivery Rate
```sql
SELECT 
  type,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN is_read THEN 1 END) as read_count,
  ROUND(COUNT(CASE WHEN is_read THEN 1 END) * 100.0 / COUNT(*), 2) as read_percentage
FROM notifications
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY type
ORDER BY total_sent DESC;
```

### Most Active Users (by notifications)
```sql
SELECT 
  p.full_name,
  COUNT(*) as notification_count
FROM notifications n
JOIN profiles p ON n.user_id = p.id
WHERE n.created_at > NOW() - INTERVAL '30 days'
GROUP BY p.id, p.full_name
ORDER BY notification_count DESC
LIMIT 10;
```

---

## Current Implementation Status

| Notification Type | Status | Trigger | Documentation |
|------------------|--------|---------|---------------|
| New Course | ✅ Implemented | Auto | NEW_COURSE_NOTIFICATION_GUIDE.md |
| Payment/Purchase | ✅ Implemented | Auto | PAYMENT_NOTIFICATION_GUIDE.md |
| Quiz | 🟡 Partial | Manual | - |
| Streak | 🟡 Partial | Manual | - |
| Achievements | 🟡 Partial | Manual | - |

---

## Security Considerations

1. **RLS Policies**: Ensure users can only access their own notifications
2. **Trigger Security**: Use `SECURITY DEFINER` carefully for trigger functions
3. **Input Validation**: Sanitize notification content to prevent XSS
4. **Rate Limiting**: Consider limiting notification frequency per user
5. **Privacy**: Don't include sensitive data in notification descriptions

---

## Performance Optimization

1. **Indexing**: 
```sql
CREATE INDEX idx_notifications_user_unread 
ON notifications(user_id, is_read) 
WHERE is_read = false;

CREATE INDEX idx_notifications_created 
ON notifications(created_at DESC);
```

2. **Archiving**: Archive old read notifications after 90 days
```sql
DELETE FROM notifications 
WHERE is_read = true 
AND created_at < NOW() - INTERVAL '90 days';
```

3. **Batch Processing**: For bulk notifications, consider background jobs

---

## Related Files

- `supabase_schema.sql` - Database schema with notifications table
- `trigger_new_course_notification.sql` - New course trigger
- `trigger_payment_notification.sql` - Payment trigger
- `NEW_COURSE_NOTIFICATION_GUIDE.md` - New course documentation
- `PAYMENT_NOTIFICATION_GUIDE.md` - Payment documentation
- `DashboardLayout.tsx` - Frontend notification display
- `useDashboard.ts` - Notification hooks

---

## Future Enhancements

1. **Email Integration**: Send important notifications via email
2. **Push Notifications**: Browser/mobile push for real-time alerts
3. **Notification Grouping**: Group similar notifications
4. **Custom Notification Sounds**: Different sounds for different types
5. **Notification Templates**: Reusable templates for consistent messaging
6. **Scheduled Notifications**: Send notifications at optimal times
7. **A/B Testing**: Test different notification messages
8. **Analytics Dashboard**: Track notification engagement
