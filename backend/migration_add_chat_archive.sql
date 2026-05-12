-- Migration: Add is_archived column to ai_chat_history table
-- Run this in your Supabase SQL Editor

-- Add is_archived column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_history' AND column_name = 'is_archived'
  ) THEN
    ALTER TABLE public.ai_chat_history ADD COLUMN is_archived boolean default false;
    
    -- Set all existing messages to not archived
    UPDATE public.ai_chat_history SET is_archived = false WHERE is_archived IS NULL;
    
    RAISE NOTICE 'Column is_archived added successfully to ai_chat_history table';
  ELSE
    RAISE NOTICE 'Column is_archived already exists in ai_chat_history table';
  END IF;
END $$;

-- Create an index for better performance when querying archived messages
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_archived 
ON public.ai_chat_history(user_id, is_archived, created_at);

-- Optional: Create a function to auto-archive old messages (can be called via cron or manually)
CREATE OR REPLACE FUNCTION archive_old_chat_messages()
RETURNS void AS $$
BEGIN
  UPDATE public.ai_chat_history
  SET is_archived = true
  WHERE is_archived = false
    AND created_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION archive_old_chat_messages() TO authenticated;
