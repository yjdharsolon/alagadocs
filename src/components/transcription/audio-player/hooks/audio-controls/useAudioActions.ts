
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useAudioActions = (audioUrl: string) => {
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

  return {
    downloadAudio,
    openDirectLink
  };
};
