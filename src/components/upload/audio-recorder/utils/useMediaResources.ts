
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useMediaResources = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupMediaResources = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    
    audioChunksRef.current = [];
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanupMediaResources();
    };
  }, []);

  return {
    mediaRecorderRef,
    audioChunksRef,
    audioPreviewRef,
    streamRef,
    cleanupMediaResources
  };
};
