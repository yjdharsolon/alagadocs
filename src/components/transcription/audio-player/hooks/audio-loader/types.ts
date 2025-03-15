
export interface AudioLoaderOptions {
  audioUrl: string | null;
  retryCount: number;
}

export interface AudioLoaderState {
  audioElement: HTMLAudioElement | null;
  isLoading: boolean;
  error: string | null;
  is403Error: boolean;
  audioDuration: number;
  currentTime: number;
}

export interface UseAudioLoaderResult extends AudioLoaderState {
  setCurrentTime: (time: number) => void;
}
