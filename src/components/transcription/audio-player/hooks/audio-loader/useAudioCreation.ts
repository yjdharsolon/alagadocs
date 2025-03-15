
import { useCallback } from 'react';
import { addCacheBuster } from '@/utils/urlUtils';
import { setupAudioElementEvents } from './useAudioElementEvents';

interface UseAudioCreationProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIs403Error: (is403Error: boolean) => void;
  setAudioDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setAudioElement: (audio: HTMLAudioElement | null) => void;
}

export const useAudioCreation = ({
  setIsLoading,
  setError,
  setIs403Error,
  setAudioDuration,
  setCurrentTime,
  setAudioElement
}: UseAudioCreationProps) => {
  const loadAudio = useCallback((url: string) => {
    // Check for empty or invalid URLs
    if (!url || url.trim() === '') {
      console.error('Attempted to load audio with empty URL');
      setIsLoading(false);
      setError("No audio URL provided");
      return null;
    }
    
    try {
      // Validate URL by attempting to create a URL object
      new URL(url);
    } catch (e) {
      console.error('Invalid URL format:', url, e);
      setIsLoading(false);
      setError(`Invalid audio URL format: ${url}`);
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
    
    // Create audio element
    const audio = new Audio();
    
    // For debugging - log any issues with the audio element
    if (!audio) {
      console.error('Failed to create audio element');
      setIsLoading(false);
      setError('Failed to create audio player');
      return null;
    }
    
    // Set crossOrigin to fix potential CORS issues with recorded audio
    audio.crossOrigin = 'anonymous';
    
    // Setup all event listeners
    setupAudioElementEvents({
      audio,
      url: urlWithCacheBuster,
      setIsLoading,
      setError,
      setIs403Error,
      setAudioDuration,
      setCurrentTime
    });
    
    // For webm files specifically (commonly used for recordings)
    if (urlWithCacheBuster.toLowerCase().includes('.webm')) {
      console.log('Detected WebM audio format, ensuring proper loading');
      // Some browsers need a small timeout before setting the src for WebM files
      setTimeout(() => {
        audio.src = urlWithCacheBuster;
      }, 100);
    } else {
      // Set the src after all event listeners are in place
      audio.src = urlWithCacheBuster;
    }
    
    // Debugging: verify src was set
    console.log(`Audio src set to: ${audio.src}`);
    
    // Store the audio element in state
    setAudioElement(audio);
    
    return audio;
  }, [setIsLoading, setError, setIs403Error, setAudioDuration, setCurrentTime, setAudioElement]);

  return { loadAudio };
};
