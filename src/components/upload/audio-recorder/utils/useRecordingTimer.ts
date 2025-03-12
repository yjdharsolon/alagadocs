
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseRecordingTimerProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
}

export const useRecordingTimer = ({
  isRecording,
  setIsRecording,
  mediaRecorderRef
}: UseRecordingTimerProps) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const maxRecordingTime = 300; // 5 minutes maximum

  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => {
          // Stop recording if max time is reached
          if (prev >= maxRecordingTime) {
            if (mediaRecorderRef.current && isRecording) {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
              toast.info('Maximum recording time reached (5 minutes)');
            }
            clearInterval(interval!);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!isRecording && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, setIsRecording, maxRecordingTime, mediaRecorderRef]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    recordingTime,
    maxRecordingTime,
    formatTime,
    setRecordingTime
  };
};
