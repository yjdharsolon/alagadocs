
export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

export interface Transcription {
  id: string;
  audio_url: string;
  text: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  duration?: number;
  language?: string;
}
