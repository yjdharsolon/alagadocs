
import { useCallback } from 'react';
import { toast } from 'sonner';
import { addCacheBuster } from '@/utils/urlUtils';

interface SetupAudioElementEventsProps {
  audio: HTMLAudioElement;
  url: string;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIs403Error: (is403Error: boolean) => void;
  setAudioDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
}

export const setupAudioElementEvents = ({
  audio,
  url,
  setIsLoading,
  setError,
  setIs403Error,
  setAudioDuration,
  setCurrentTime
}: SetupAudioElementEventsProps) => {
  // Set up event listeners before setting src
  audio.addEventListener('loadedmetadata', () => {
    console.log('Audio metadata loaded successfully');
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
  
  audio.addEventListener('canplaythrough', () => {
    // If we get to this point, the audio is definitely loaded
    console.log('Audio can be played through without buffering');
    setIsLoading(false);
    if (audio.duration && isFinite(audio.duration)) {
      setAudioDuration(Math.floor(audio.duration));
    }
  });
  
  audio.addEventListener('error', (e) => {
    const errorCode = audio.error?.code || 0;
    const errorMessage = audio.error?.message || 'Unknown error';
    console.error(`Error loading audio file: ${errorMessage} (code: ${errorCode})`, e);
    
    // Add more diagnostic info
    console.log('Audio src at time of error:', audio.src);
    
    setIsLoading(false);
    
    // Try to get more info about the audio file
    fetch(url, { method: 'HEAD' })
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
  
  // Set audio preload attribute programmatically (HTMLAudioElement doesn't have this as a property)
  audio.setAttribute('preload', 'auto');
};
