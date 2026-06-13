-- ============================================================
-- TRIGGER: Notify All Users When New Course is Added
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Function to create notifications for all users when a new course is added
CREATE OR REPLACE FUNCTION notify_users_new_course()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notifications if the course is published
  IF NEW.is_published = true THEN
    -- Insert a notification for each user who has notif_new_course enabled
    INSERT INTO public.notifications (user_id, type, title, description, is_read)
    SELECT 
      p.id,
      'course',
      '🎓 New Course Available!',
      'Check out the new course: ' || NEW.emoji || ' ' || NEW.title,
      false
    FROM public.profiles p
    WHERE p.notif_new_course = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_new_course_notify_users ON public.courses;

-- Create trigger that fires after a new course is inserted
CREATE TRIGGER on_new_course_notify_users
  AFTER INSERT ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION notify_users_new_course();

-- ============================================================
-- TEST: Add a test course to verify the trigger works
-- ============================================================
-- Uncomment the lines below to test:

-- INSERT INTO public.courses (title, emoji, description, level, duration_weeks, price_inr, is_free, is_published)
-- VALUES ('Test Course', '🧪', 'This is a test course to verify notifications', 'Beginner', 4, 0, true, true);

-- Check if notifications were created:
-- SELECT * FROM public.notifications WHERE title LIKE '%New Course%' ORDER BY created_at DESC LIMIT 10;


-- ============================================================
-- BONUS: Function to manually notify users about a specific course
-- Useful if you want to re-notify users about an existing course
-- ============================================================

CREATE OR REPLACE FUNCTION notify_users_about_course(course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  course_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- Get the course details
  SELECT * INTO course_record FROM public.courses WHERE id = course_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;
  
  -- Insert notifications for all users with notifications enabled
  INSERT INTO public.notifications (user_id, type, title, description, is_read)
  SELECT 
    p.id,
    'course',
    '🎓 ' || course_record.title || ' Available!',
    course_record.description || ' - ' || course_record.level || ' level, ' || course_record.duration_weeks || ' weeks',
    false
  FROM public.profiles p
  WHERE p.notif_new_course = true;
  
  GET DIAGNOSTICS notification_count = ROW_COUNT;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage example:
-- SELECT notify_users_about_course('course-uuid-here');
