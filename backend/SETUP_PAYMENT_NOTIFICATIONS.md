# Quick Setup: Payment Notifications

## What This Does
Automatically creates notifications for users when they:
- Purchase a course (paid)
- Enroll in a free course
- Have a pending payment that gets confirmed

## Setup Instructions

### 1. Run SQL Script in Supabase
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy all content from `trigger_payment_notification.sql`
4. Click **Run** to execute

### 2. Verify Installation
Run this query to check if triggers were created:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%payment%';
```

You should see:
- `on_payment_notify_user` (INSERT trigger)
- `on_payment_update_notify_user` (UPDATE trigger)

### 3. Test It
Insert a test payment:
```sql
-- Replace with actual user_id and course_id
INSERT INTO public.payments (user_id, course_id, amount_inr, status)
VALUES ('your-user-uuid', 'your-course-uuid', 1499, 'paid');
```

Check if notification was created:
```sql
SELECT * FROM public.notifications 
WHERE type = 'payment' 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4. That's It!
The notification system is now live. Every time a payment is made:
- User gets a notification immediately
- Notification appears in their dashboard dropdown
- They can mark it as read or view details

## Notification Examples

**Free Course Enrollment:**
```
Title: 🎉 Course Enrolled Successfully!
Description: You have successfully enrolled in 🎨 HTML & CSS Fundamentals. Start learning now!
```

**Paid Course:**
```
Title: ✅ Payment Successful!
Description: Payment of ₹1,499 received for 🌐 Full Stack Web Development. Happy learning!
```

**Pending Payment:**
```
Title: ⏳ Payment Pending
Description: Your payment for ⚛️ React & Next.js Mastery is being processed...
```

## User Control
Users can enable/disable payment notifications in their profile settings via the `notif_payment` field.

## For More Details
See `PAYMENT_NOTIFICATION_GUIDE.md` for complete documentation.
