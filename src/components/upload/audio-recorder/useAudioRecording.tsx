
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAudioRecordingProps {
  onRecordingComplete: (file: File) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  setIsPlayingPreview: (isPlaying: boolean) => void;
}

export const useAudioRecording = ({
  onRecordingComplete,
  isRecording,
  setIsRecording,
  setIsPlayingPreview
}: UseAudioRecordingProps) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxRecordingTime = 300; // 5 minutes maximum

  // Cleanup function for media resources
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

  // Timer for recording duration
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
  }, [isRecording, setIsRecording, maxRecordingTime]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      cleanupMediaResources();
      
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Clear previous recording if exists
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
        setAudioPreview(null);
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Try different mime types for better compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: `${mimeType}`
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const fileExtension = mimeType.split('/')[1];
        const audioFile = new File(
          [audioBlob], 
          `recording-${Date.now()}.${fileExtension}`, 
          { type: mimeType }
        );
        
        // Create an audio preview URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        
        onRecordingComplete(audioFile);
        
        // Stop all tracks in the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      // Start recording with a 100ms timeslice for better streaming
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
      cleanupMediaResources();
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.success('Recording finished');
      } catch (err) {
        console.error('Error stopping recording:', err);
        toast.error('Error finishing recording');
        cleanupMediaResources();
      }
    }
  };
  
  const resetRecording = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
      setRecordingTime(0);
      toast.info('Recording cleared');
    }
  };
  
  const togglePlayPreview = () => {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    startRecording,
    stopRecording,
    resetRecording,
    audioPreview,
    recordingTime,
    maxRecordingTime,
    formatTime,
    audioPreviewRef,
    togglePlayPreview
  };
};
