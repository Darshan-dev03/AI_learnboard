-- ============================================================
-- TRIGGER: Notify User When Payment is Made
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Function to create notification when a user makes a payment
CREATE OR REPLACE FUNCTION notify_user_payment()
RETURNS TRIGGER AS $
DECLARE
  course_record RECORD;
  user_notif_enabled BOOLEAN;
BEGIN
  -- Check if user has payment notifications enabled
  SELECT notif_payment INTO user_notif_enabled
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Only create notification if user has payment notifications enabled
  IF user_notif_enabled = true THEN
    -- Get course details
    SELECT * INTO course_record FROM public.courses WHERE id = NEW.course_id;
    
    -- Create notification based on payment status
    IF NEW.status = 'paid' OR NEW.status = 'free' THEN
      INSERT INTO public.notifications (user_id, type, title, description, is_read)
      VALUES (
        NEW.user_id,
        'payment',
        CASE 
          WHEN NEW.amount_inr = 0 OR NEW.status = 'free' THEN '🎉 Course Enrolled Successfully!'
          ELSE '✅ Payment Successful!'
        END,
        CASE 
          WHEN NEW.amount_inr = 0 OR NEW.status = 'free' THEN 
            'You have successfully enrolled in ' || COALESCE(course_record.emoji, '📚') || ' ' || COALESCE(course_record.title, 'the course') || '. Start learning now!'
          ELSE 
            'Payment of ₹' || NEW.amount_inr || ' received for ' || COALESCE(course_record.emoji, '📚') || ' ' || COALESCE(course_record.title, 'the course') || '. Happy learning!'
        END,
        false
      );
    ELSIF NEW.status = 'pending' THEN
      INSERT INTO public.notifications (user_id, type, title, description, is_read)
      VALUES (
        NEW.user_id,
        'payment',
        '⏳ Payment Pending',
        'Your payment for ' || COALESCE(course_record.emoji, '📚') || ' ' || COALESCE(course_record.title, 'the course') || ' is being processed. You will be notified once confirmed.',
        false
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_payment_notify_user ON public.payments;

-- Create trigger that fires after a new payment is inserted
CREATE TRIGGER on_payment_notify_user
  AFTER INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_payment();

-- ============================================================
-- BONUS TRIGGER: Notify on Payment Status Update
-- Useful when payment status changes from pending to paid
-- ============================================================

CREATE OR REPLACE FUNCTION notify_user_payment_update()
RETURNS TRIGGER AS $
DECLARE
  course_record RECORD;
  user_notif_enabled BOOLEAN;
BEGIN
  -- Only trigger if status changed to paid from another status
  IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
    -- Check if user has payment notifications enabled
    SELECT notif_payment INTO user_notif_enabled
    FROM public.profiles
    WHERE id = NEW.user_id;
    
    IF user_notif_enabled = true THEN
      -- Get course details
      SELECT * INTO course_record FROM public.courses WHERE id = NEW.course_id;
      
      INSERT INTO public.notifications (user_id, type, title, description, is_read)
      VALUES (
        NEW.user_id,
        'payment',
        '✅ Payment Confirmed!',
        'Your payment for ' || COALESCE(course_record.emoji, '📚') || ' ' || COALESCE(course_record.title, 'the course') || ' has been confirmed. You can now access all course content!',
        false
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_payment_update_notify_user ON public.payments;

-- Create trigger that fires after a payment is updated
CREATE TRIGGER on_payment_update_notify_user
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_payment_update();

-- ============================================================
-- TEST: Insert a test payment to verify the trigger works
-- ============================================================
-- Uncomment and modify the lines below to test:

-- First, get a valid user_id and course_id:
-- SELECT id FROM auth.users LIMIT 1;  -- Get a user ID
-- SELECT id FROM public.courses LIMIT 1;  -- Get a course ID

-- Then insert a test payment (replace UUIDs with actual values):
-- INSERT INTO public.payments (user_id, course_id, amount_inr, status)
-- VALUES ('user-uuid-here', 'course-uuid-here', 1499, 'paid');

-- Check if notification was created:
-- SELECT * FROM public.notifications WHERE type = 'payment' ORDER BY created_at DESC LIMIT 10;

-- Test free enrollment:
-- INSERT INTO public.payments (user_id, course_id, amount_inr, status)
-- VALUES ('user-uuid-here', 'course-uuid-here', 0, 'free');

-- Test pending payment:
-- INSERT INTO public.payments (user_id, course_id, amount_inr, status)
-- VALUES ('user-uuid-here', 'course-uuid-here', 999, 'pending');

-- Then update to paid:
-- UPDATE public.payments SET status = 'paid' WHERE id = 'payment-uuid-here';

-- ============================================================
-- CLEANUP (run only if you want to remove the triggers)
-- ============================================================
-- DROP TRIGGER IF EXISTS on_payment_notify_user ON public.payments;
-- DROP TRIGGER IF EXISTS on_payment_update_notify_user ON public.payments;
-- DROP FUNCTION IF EXISTS notify_user_payment();
-- DROP FUNCTION IF EXISTS notify_user_payment_update();
