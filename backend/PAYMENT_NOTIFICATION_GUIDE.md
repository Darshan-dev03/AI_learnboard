# Payment Notification System

## Overview
This system automatically creates notifications for users when they make payments or purchase courses in the AI LearnBoard platform.

## Features

### 1. Automatic Notifications on Payment
When a user makes a payment or enrolls in a course, they automatically receive a notification based on:
- **Free Enrollment** (₹0 or status = 'free'): "🎉 Course Enrolled Successfully!"
- **Paid Course**: "✅ Payment Successful!" with the amount
- **Pending Payment**: "⏳ Payment Pending" - waiting for confirmation

### 2. Payment Status Update Notifications
If a payment status changes from `pending` to `paid`, users receive a confirmation notification.

### 3. User Preference Respect
Notifications are only created if the user has `notif_payment` enabled in their profile settings.

## Database Schema

### Notifications Table
```sql
notifications (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  type text,                    -- 'payment'
  title text,                   -- Notification title
  description text,             -- Detailed message
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
)
```

### Profiles Notification Setting
```sql
profiles (
  ...
  notif_payment boolean DEFAULT true,  -- User can enable/disable payment notifications
  ...
)
```

## Installation

### Step 1: Run SQL in Supabase
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `trigger_payment_notification.sql`
4. Run the SQL script

### Step 2: Verify Triggers Created
Check that these triggers and functions exist:
- Function: `notify_user_payment()`
- Function: `notify_user_payment_update()`
- Trigger: `on_payment_notify_user` on `payments` table (INSERT)
- Trigger: `on_payment_update_notify_user` on `payments` table (UPDATE)

## How It Works

### Flow Diagram
```
User Makes Payment
    ↓
Payment Record Inserted/Updated in Database
    ↓
Trigger Executes
    ↓
Check if user has notif_payment = true
    ↓
Get Course Details (emoji, title)
    ↓
Create Notification with appropriate message
    ↓
User sees notification in Notifications dropdown
```

## Notification Messages

### Free Enrollment (₹0)
- **Title**: "🎉 Course Enrolled Successfully!"
- **Description**: "You have successfully enrolled in [emoji] [course title]. Start learning now!"

### Paid Course
- **Title**: "✅ Payment Successful!"
- **Description**: "Payment of ₹[amount] received for [emoji] [course title]. Happy learning!"

### Pending Payment
- **Title**: "⏳ Payment Pending"
- **Description**: "Your payment for [emoji] [course title] is being processed. You will be notified once confirmed."

### Payment Confirmed (from pending)
- **Title**: "✅ Payment Confirmed!"
- **Description**: "Your payment for [emoji] [course title] has been confirmed. You can now access all course content!"

## Testing

### Test Free Enrollment
```sql
-- Get IDs
SELECT id FROM auth.users LIMIT 1;
SELECT id FROM public.courses WHERE is_free = true LIMIT 1;

-- Insert free payment
INSERT INTO public.payments (user_id, course_id, amount_inr, status)
VALUES ('user-uuid', 'course-uuid', 0, 'free');

-- Check notification
SELECT * FROM public.notifications 
WHERE type = 'payment' 
ORDER BY created_at DESC 
LIMIT 1;
```

### Test Paid Course
```sql
INSERT INTO public.payments (user_id, course_id, amount_inr, status)
VALUES ('user-uuid', 'course-uuid', 1499, 'paid');
```

### Test Pending → Paid Flow
```sql
-- Insert pending payment
INSERT INTO public.payments (user_id, course_id, amount_inr, status)
VALUES ('user-uuid', 'course-uuid', 999, 'pending')
RETURNING id;

-- Update to paid (use the ID returned above)
UPDATE public.payments 
SET status = 'paid' 
WHERE id = 'payment-uuid';

-- Should see 2 notifications: one for pending, one for confirmed
```

## User Settings

Users can control payment notifications in their profile settings:

```typescript
// Update user notification preference
await supabase
  .from('profiles')
  .update({ notif_payment: true })  // or false to disable
  .eq('id', userId);
```

## Integration with Frontend

The notifications automatically appear in the user's notification dropdown in the dashboard navbar. The existing notification system handles:
- Displaying unread notification count
- Showing notification list
- Marking notifications as read
- Real-time updates

## Security

- **Row Level Security (RLS)**: Notifications table has RLS policies ensuring users can only see their own notifications
- **SECURITY DEFINER**: Trigger functions run with elevated privileges to insert notifications
- **User Preference Check**: Respects user's notification settings before creating notifications

## Maintenance

### View Recent Payment Notifications
```sql
SELECT 
  n.title,
  n.description,
  n.is_read,
  n.created_at,
  p.full_name as user_name
FROM notifications n
JOIN profiles p ON n.user_id = p.id
WHERE n.type = 'payment'
ORDER BY n.created_at DESC
LIMIT 20;
```

### Disable Notifications for All Users
```sql
UPDATE public.profiles SET notif_payment = false;
```

### Re-enable Notifications for All Users
```sql
UPDATE public.profiles SET notif_payment = true;
```

## Troubleshooting

### Notifications Not Appearing
1. Check if trigger exists: `\df notify_user_payment` in SQL Editor
2. Verify user has `notif_payment = true`
3. Check if payment was actually inserted: `SELECT * FROM payments ORDER BY paid_at DESC LIMIT 10`
4. Look for errors in Supabase logs

### Duplicate Notifications
- Ensure trigger is created only once
- Check for multiple trigger definitions: `SELECT * FROM information_schema.triggers WHERE trigger_name LIKE '%payment%'`

### Missing Course Details
- Ensure `course_id` is valid when inserting payment
- Verify courses table has the referenced course

## Future Enhancements

Potential improvements:
1. **Email notifications** for important payments
2. **Push notifications** for mobile apps
3. **Payment receipt** generation
4. **Refund notifications** 
5. **Subscription renewal reminders**

---

## Related Files
- `trigger_payment_notification.sql` - SQL trigger definitions
- `supabase_schema.sql` - Database schema
- `trigger_new_course_notification.sql` - New course notifications
