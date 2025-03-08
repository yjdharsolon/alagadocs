
-- Create transcriptions table to track audio uploads and transcription status
CREATE TABLE IF NOT EXISTS public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  audio_url TEXT NOT NULL,
  text TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded',
  error_message TEXT,
  duration FLOAT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create notes table to store structured transcription notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for transcriptions
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transcriptions
CREATE POLICY transcriptions_select_policy ON public.transcriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own transcriptions
CREATE POLICY transcriptions_insert_policy ON public.transcriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own transcriptions
CREATE POLICY transcriptions_update_policy ON public.transcriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own transcriptions
CREATE POLICY transcriptions_delete_policy ON public.transcriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Users can view their own notes
CREATE POLICY notes_select_policy ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own notes
CREATE POLICY notes_insert_policy ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY notes_update_policy ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY notes_delete_policy ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create a storage bucket for audio files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('transcriptions', 'transcriptions', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the transcriptions bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transcriptions');

-- Allow users to select their own files from the transcriptions bucket
CREATE POLICY "Allow users to view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'transcriptions' AND (auth.uid() = owner OR owner IS NULL));

-- Allow users to update their own files in the transcriptions bucket
CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'transcriptions' AND auth.uid() = owner);

-- Allow users to delete their own files from the transcriptions bucket
CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'transcriptions' AND auth.uid() = owner);
