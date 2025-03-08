
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, RefreshCw, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete,
  isRecording: externalIsRecording,
  setIsRecording: externalSetIsRecording
}) => {
  // Use internal state if external state is not provided
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxRecordingTime = 300; // 5 minutes maximum
  
  // Determine which state to use
  const isRecording = externalIsRecording !== undefined ? externalIsRecording : internalIsRecording;
  const setIsRecording = externalSetIsRecording || setInternalIsRecording;

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

  // Effect for controlling audio preview playback
  useEffect(() => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.onended = () => {
        setIsPlayingPreview(false);
      };
    }
  }, [audioPreview]);

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
      if (isPlayingPreview) {
        audioPreviewRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        audioPreviewRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          toast.error('Could not play the recording');
        });
        setIsPlayingPreview(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {audioPreview && (
        <div className="flex flex-col items-center p-4 rounded-md bg-muted/50">
          <audio ref={audioPreviewRef} src={audioPreview} className="hidden"></audio>
          <div className="flex gap-2 w-full mb-2">
            <Button 
              type="button"
              variant="secondary" 
              size="sm"
              onClick={togglePlayPreview}
              className="flex-1 gap-2"
            >
              {isPlayingPreview ? (
                <><Pause className="h-4 w-4" /> Pause</>
              ) : (
                <><Play className="h-4 w-4" /> Play Preview</>
              )}
            </Button>
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              onClick={resetRecording}
              className="flex-shrink-0 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recording length: {formatTime(recordingTime)}
          </p>
        </div>
      )}
      
      {isRecording ? (
        <div className="space-y-4">
          <div className="animate-pulse flex items-center justify-center p-4">
            <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatTime(recordingTime)}</span>
              <span>{formatTime(maxRecordingTime)}</span>
            </div>
            <Progress value={(recordingTime / maxRecordingTime) * 100} />
          </div>
          <Button 
            variant="destructive" 
            size="lg" 
            onClick={stopRecording}
            className="w-full gap-2"
          >
            <StopCircle className="h-4 w-4" />
            Stop Recording
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-24 w-24 rounded-full"
            onClick={startRecording}
            disabled={isPlayingPreview}
          >
            <Mic className="h-10 w-10" />
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Click to start recording your voice
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum recording time is 5 minutes
          </p>
        </div>
      )}
    </div>
  );
};
