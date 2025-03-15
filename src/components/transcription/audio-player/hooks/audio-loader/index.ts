
import { useState, useEffect, useCallback } from 'react';
import { useAudioCreation } from './useAudioCreation';
import { AudioLoaderOptions, UseAudioLoaderResult } from './types';

export const useAudioLoader = ({ audioUrl, retryCount }: AudioLoaderOptions): UseAudioLoaderResult => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is403Error, setIs403Error] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { loadAudio } = useAudioCreation({
    setIsLoading,
    setError,
    setIs403Error,
    setAudioDuration,
    setCurrentTime,
    setAudioElement
  });

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    if (audioUrl && audioUrl.trim() !== '') {
      audio = loadAudio(audioUrl);
    } else {
      setIsLoading(false);
      setError("No audio URL provided");
    }
    
    return () => {
      if (audio) {
        // Properly clean up the audio element
        audio.pause();
        audio.removeAttribute('src'); // Safer than setting to empty string
        audio.load(); // This forces the audio element to reset
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

// Re-export types for easier imports
export * from './types';
