
export interface TranscriptionResponse {
  transcription: string;
  duration?: number;
  language?: string;
}

export interface AudioProcessingConfig {
  maxRetries: number;
  baseRetryDelay: number;
}
