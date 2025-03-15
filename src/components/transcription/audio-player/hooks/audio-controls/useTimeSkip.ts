
import { useCallback } from 'react';

export const useTimeSkip = (
  audioElement: HTMLAudioElement | null,
  audioDuration: number,
  setCurrentTime: (time: number) => void
) => {
  const skipBackward = useCallback(() => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  }, [audioElement, setCurrentTime]);
  
  const skipForward = useCallback(() => {
    if (!audioElement) return;
    audioElement.currentTime = Math.min(audioDuration, audioElement.currentTime + 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  }, [audioElement, audioDuration, setCurrentTime]);

  return {
    skipBackward,
    skipForward
  };
};
