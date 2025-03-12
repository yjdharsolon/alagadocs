
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAudioControlsProps {
  audioElement: HTMLAudioElement | null;
  audioUrl: string;
  audioDuration: number;
  setCurrentTime: (time: number) => void;
}

interface UseAudioControlsResult {
  isPlaying: boolean;
  togglePlayPause: () => void;
  skipBackward: () => void;
  skipForward: () => void;
  downloadAudio: () => void;
  openDirectLink: () => void;
}

export const useAudioControls = ({
  audioElement, 
  audioUrl, 
  audioDuration,
  setCurrentTime
}: UseAudioControlsProps): UseAudioControlsResult => {
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
  
  const downloadAudio = useCallback(() => {
    if (!audioUrl) {
      toast.error('No audio available for download');
      return;
    }
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'transcription_audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Audio download started');
  }, [audioUrl]);

  const openDirectLink = useCallback(() => {
    if (!audioUrl) return;
    window.open(audioUrl, '_blank');
  }, [audioUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        togglePlayPause();
      }
      
      if (e.code === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipBackward();
      }
      
      if (e.code === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipForward();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause, skipBackward, skipForward]);

  return {
    isPlaying,
    togglePlayPause,
    skipBackward,
    skipForward,
    downloadAudio,
    openDirectLink
  };
};
