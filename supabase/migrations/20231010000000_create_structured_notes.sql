
-- Create a table for structured notes
CREATE TABLE IF NOT EXISTS public.structured_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transcription_id UUID NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS structured_notes_user_id_idx ON public.structured_notes (user_id);
CREATE INDEX IF NOT EXISTS structured_notes_transcription_id_idx ON public.structured_notes (transcription_id);

-- Enable Row Level Security
ALTER TABLE public.structured_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Users can view their own structured notes"
  ON public.structured_notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own structured notes"
  ON public.structured_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own structured notes"
  ON public.structured_notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own structured notes"
  ON public.structured_notes
  FOR DELETE
  USING (auth.uid() = user_id);
