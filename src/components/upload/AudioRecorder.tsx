
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, RefreshCw } from 'lucide-react';
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
  const maxRecordingTime = 300; // 5 minutes maximum
  
  // Determine which state to use
  const isRecording = externalIsRecording !== undefined ? externalIsRecording : internalIsRecording;
  const setIsRecording = externalSetIsRecording || setInternalIsRecording;

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
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime, setIsRecording, maxRecordingTime]);

  // Effect for controlling audio preview playback
  useEffect(() => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.onended = () => {
        setIsPlayingPreview(false);
      };
    }
  }, [audioPreview]);

  const startRecording = async () => {
    try {
      // Clear previous recording if exists
      if (audioPreview) {
        setAudioPreview(null);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        
        // Create an audio preview URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        
        onRecordingComplete(audioFile);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording finished');
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
        <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
          <audio ref={audioPreviewRef} src={audioPreview} className="hidden"></audio>
          <div className="flex gap-2 w-full mb-2">
            <Button 
              type="button"
              variant="secondary" 
              size="sm"
              onClick={togglePlayPreview}
              className="flex-1"
            >
              {isPlayingPreview ? 'Pause' : 'Play'} Preview
            </Button>
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              onClick={resetRecording}
              className="flex-shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
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
            className="w-full"
          >
            <StopCircle className="h-4 w-4 mr-2" />
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
