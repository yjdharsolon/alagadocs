
import { useState } from 'react';
import { toast } from 'sonner';
import { useRecordingTimer } from './utils/useRecordingTimer';
import { useMediaResources } from './utils/useMediaResources';
import { useAudioPreview } from './utils/useAudioPreview';

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
  const {
    mediaRecorderRef,
    audioChunksRef,
    audioPreviewRef,
    streamRef,
    cleanupMediaResources
  } = useMediaResources();

  const {
    recordingTime,
    maxRecordingTime,
    formatTime,
    setRecordingTime
  } = useRecordingTimer({
    isRecording,
    setIsRecording,
    mediaRecorderRef
  });

  const {
    audioPreview,
    setAudioPreview,
    isPlayingPreview: localIsPlayingPreview,
    setIsPlayingPreview: setLocalIsPlayingPreview,
    resetAudioPreview,
    togglePlayPreview
  } = useAudioPreview();

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

  // Update external isPlayingPreview state when local state changes
  const handleTogglePlayPreview = () => {
    togglePlayPreview(audioPreviewRef);
    setIsPlayingPreview(localIsPlayingPreview);
  };

  return {
    startRecording,
    stopRecording,
    resetRecording: resetAudioPreview,
    audioPreview,
    recordingTime,
    maxRecordingTime,
    formatTime,
    audioPreviewRef,
    togglePlayPreview: handleTogglePlayPreview
  };
};
