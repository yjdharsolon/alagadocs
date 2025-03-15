
export interface UseAudioControlsProps {
  audioElement: HTMLAudioElement | null;
  audioUrl: string;
  audioDuration: number;
  setCurrentTime: (time: number) => void;
}

export interface UseAudioControlsResult {
  isPlaying: boolean;
  togglePlayPause: () => void;
  skipBackward: () => void;
  skipForward: () => void;
  downloadAudio: () => void;
  openDirectLink: () => void;
}
