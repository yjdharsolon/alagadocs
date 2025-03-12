
import { useState } from 'react';
import { toast } from 'sonner';

export const useAudioPreview = () => {
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const resetAudioPreview = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
      toast.info('Recording cleared');
    }
  };

  const togglePlayPreview = (audioPreviewRef: React.RefObject<HTMLAudioElement>) => {
    if (audioPreviewRef.current) {
      if (audioPreviewRef.current.paused) {
        audioPreviewRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          toast.error('Could not play the recording');
        });
        setIsPlayingPreview(true);
      } else {
        audioPreviewRef.current.pause();
        setIsPlayingPreview(false);
      }
    }
  };

  return {
    audioPreview,
    setAudioPreview,
    isPlayingPreview,
    setIsPlayingPreview,
    resetAudioPreview,
    togglePlayPreview
  };
};
