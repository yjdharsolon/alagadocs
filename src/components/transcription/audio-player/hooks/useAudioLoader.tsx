
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { addCacheBuster } from '@/utils/urlUtils';

interface UseAudioLoaderProps {
  audioUrl: string | null;
  retryCount: number;
}

interface UseAudioLoaderResult {
  audioElement: HTMLAudioElement | null;
  isLoading: boolean;
  error: string | null;
  is403Error: boolean;
  audioDuration: number;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

export const useAudioLoader = ({ audioUrl, retryCount }: UseAudioLoaderProps): UseAudioLoaderResult => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is403Error, setIs403Error] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const loadAudio = useCallback((url: string) => {
    if (!url) {
      setIsLoading(false);
      setError("No audio URL provided");
      return null;
    }
    
    // Normalize URL - remove existing cache busters to prevent duplicates
    const normalizedUrl = url.split('?')[0];
    
    // Only then add a single cache buster
    const urlWithCacheBuster = addCacheBuster(normalizedUrl);
    
    setIsLoading(true);
    setError(null);
    setIs403Error(false);
    
    console.log(`Loading audio from URL: ${urlWithCacheBuster}`);
    const audio = new Audio(urlWithCacheBuster);
    setAudioElement(audio);
    
    audio.addEventListener('loadedmetadata', () => {
      if (isFinite(audio.duration)) {
        setAudioDuration(Math.floor(audio.duration));
        console.log(`Audio duration: ${audio.duration}`);
      } else {
        setAudioDuration(0);
        console.log('Audio duration is not a finite number');
      }
      setIsLoading(false);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(Math.floor(audio.currentTime));
    });
    
    audio.addEventListener('ended', () => {
      setCurrentTime(0);
      audio.currentTime = 0;
    });
    
    audio.addEventListener('error', (e) => {
      const errorCode = audio.error?.code || 0;
      const errorMessage = audio.error?.message || 'Unknown error';
      console.error(`Error loading audio file: ${errorMessage} (code: ${errorCode})`, e);
      setIsLoading(false);
      
      fetch(urlWithCacheBuster, { method: 'HEAD' })
        .then(response => {
          if (response.status === 403) {
            setIs403Error(true);
            setError(`Permission denied (403 Forbidden). You don't have access to this audio file.`);
            console.error('403 Forbidden error detected when accessing audio');
          } else if (errorCode === 2) {
            setError(`Network error loading audio. Please check your connection.`);
          } else if (errorCode === 3) {
            setError(`Decoding error. Audio format may not be supported.`);
          } else if (errorCode === 4) {
            setError(`Cannot load audio (${errorMessage}). This may be due to permissions.`);
          } else {
            setError(`Cannot load audio (${errorMessage})`);
          }
        })
        .catch(() => {
          if (errorCode === 2) {
            setError(`Network error loading audio. Please check your connection.`);
          } else if (errorCode === 3) {
            setError(`Decoding error. Audio format may not be supported.`);
          } else if (errorCode === 4) {
            setError(`Cannot load audio (${errorMessage}). This may be due to permissions.`);
          } else {
            setError(`Cannot load audio (${errorMessage})`);
          }
        });
      
      toast.error('Error loading audio file');
    });
    
    return audio;
  }, []);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    if (audioUrl) {
      audio = loadAudio(audioUrl);
    } else {
      setIsLoading(false);
      setError("No audio URL provided");
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audioUrl, loadAudio, retryCount]);

  return {
    audioElement,
    isLoading,
    error,
    is403Error,
    audioDuration,
    currentTime,
    setCurrentTime
  };
};
