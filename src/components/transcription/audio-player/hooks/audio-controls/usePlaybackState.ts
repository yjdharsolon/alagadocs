
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const usePlaybackState = (audioElement: HTMLAudioElement | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayPause = useCallback(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Error playing audio. Please try again.');
      });
    }
    
    setIsPlaying(!isPlaying);
  }, [audioElement, isPlaying]);

  return {
    isPlaying,
    togglePlayPause
  };
};
