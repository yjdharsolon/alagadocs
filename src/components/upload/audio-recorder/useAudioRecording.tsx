
import { useState } from 'react';
import { toast } from 'sonner';
import { useRecordingTimer } from './utils/useRecordingTimer';
import { useMediaResources } from './utils/useMediaResources';
import { useAudioPreview } from './utils/useAudioPreview';
import { useRecordingSetup } from './utils/useRecordingSetup';

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

  const { setupRecorder } = useRecordingSetup();

  const startRecording = async () => {
    // Clear previous recording if exists
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
    
    const success = await setupRecorder({
      streamRef,
      mediaRecorderRef,
      audioChunksRef,
      setAudioPreview,
      setIsRecording,
      setRecordingTime,
      onRecordingComplete
    });
    
    if (!success) {
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
