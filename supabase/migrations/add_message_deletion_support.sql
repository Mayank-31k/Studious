-- Migration: Add Message Deletion Support
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Add deleted_at and file_size columns to messages
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT NULL;

-- 2. Create message_deletions table for "delete for me" feature
CREATE TABLE IF NOT EXISTS message_deletions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(message_id, user_id)
);

-- 3. Enable RLS
ALTER TABLE message_deletions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for message_deletions
CREATE POLICY "Users can insert their own deletions"
ON message_deletions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deletions"
ON message_deletions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deletion records"
ON message_deletions FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Add policy for messages soft delete (sender can update deleted_at)
CREATE POLICY "Sender can soft delete their messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- 6. Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_message_deletions_user_id ON message_deletions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_deletions_message_id ON message_deletions(message_id);
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at) WHERE deleted_at IS NOT NULL;
