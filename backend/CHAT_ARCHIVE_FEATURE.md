# AI Chat Archive Feature

## Overview
The AI Assistant now automatically archives chat messages older than 1 day, giving users a fresh chat experience while preserving their conversation history.

## Features

### 1. **Automatic Archiving**
- Messages older than 1 day are automatically archived when the user opens the AI Assistant
- Archived messages are stored in the database but hidden from the active chat view
- Users start with a clean chat interface each day

### 2. **Manual Clear Chat**
- Users can manually clear their current chat using the "Clear Chat" button
- All current messages are archived and the chat starts fresh
- A confirmation dialog prevents accidental clearing

### 3. **Message Preservation**
- All messages are preserved in the database with `is_archived = true`
- Archived messages can be retrieved later if needed
- No data is permanently deleted

## Database Changes

### New Column
- Added `is_archived` boolean column to `ai_chat_history` table
- Default value: `false`
- Indexed for performance: `(user_id, is_archived, created_at)`

### Migration
Run the migration file in your Supabase SQL Editor:
```bash
ai-learnboard/backend/migration_add_chat_archive.sql
```

## How It Works

### On Component Load
1. When user opens AI Assistant, `archiveOldMessages()` runs
2. All messages older than 1 day are marked as `is_archived = true`
3. Only non-archived messages are fetched and displayed

### On Send Message
1. New messages are saved with `is_archived = false`
2. Messages appear immediately in the chat
3. Real-time updates work seamlessly

### On Clear Chat
1. User clicks "Clear Chat" button
2. Confirmation dialog appears
3. All current messages are marked as `is_archived = true`
4. Chat interface clears and shows empty state

## User Experience

### Before (Old Behavior)
- Chat history accumulated indefinitely
- Long scrolling to find recent conversations
- Cluttered interface

### After (New Behavior)
- ✅ Fresh chat every day
- ✅ Clean, focused interface
- ✅ Manual clear option for privacy
- ✅ All history preserved in database
- ✅ No data loss

## Future Enhancements

### Possible Additions
1. **View Archive**: Add a button to view archived conversations
2. **Search Archive**: Search through old messages
3. **Export Chat**: Download chat history as PDF/text
4. **Custom Archive Period**: Let users choose archive period (1 day, 3 days, 1 week)
5. **Scheduled Cleanup**: Use Supabase cron jobs to auto-archive at midnight

### Database Function
A helper function `archive_old_chat_messages()` is included in the migration that can be:
- Called manually via SQL
- Scheduled using Supabase cron jobs
- Triggered by a backend API endpoint

## Testing

### Test Automatic Archiving
1. Create some chat messages
2. Manually update their `created_at` to 2 days ago in Supabase
3. Refresh the AI Assistant page
4. Messages should be archived and not visible

### Test Manual Clear
1. Send some messages in the chat
2. Click "Clear Chat" button
3. Confirm the dialog
4. Chat should clear and show empty state
5. Check database - messages should have `is_archived = true`

### Test Real-time Updates
1. Send a message
2. It should appear immediately without refresh
3. AI response should also appear immediately

## Code Changes

### Files Modified
1. `ai-learnboard/src/lib/hooks/useDashboard.ts`
   - Added `archiveOldMessages()` function
   - Added `clearChat()` function
   - Updated `fetch()` to filter by `is_archived = false`
   - Updated `saveMessage()` to set `is_archived = false`

2. `ai-learnboard/src/pages/dashboard/AIAssistant.tsx`
   - Added "Clear Chat" button with Trash2 icon
   - Added confirmation dialog
   - Added toast notification on archive

3. `ai-learnboard/backend/supabase_schema.sql`
   - Added `is_archived` column to table definition
   - Added migration script

4. `ai-learnboard/backend/migration_add_chat_archive.sql`
   - New file with migration SQL
   - Includes index creation
   - Includes helper function

## Support

If you encounter any issues:
1. Ensure the migration has been run in Supabase
2. Check browser console for errors
3. Verify Supabase connection is working
4. Check that `is_archived` column exists in `ai_chat_history` table
