
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

  const { setupRecorder, completeRecordingWithName } = useRecordingSetup();

  // State for file naming dialog
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempBlob, setTempBlob] = useState<Blob | null>(null);
  const [defaultFileName, setDefaultFileName] = useState('');

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
      onRecordingComplete,
      setShowNameDialog,
      setTempBlob,
      setDefaultFileName
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

  // Function to save recording with a custom name
  const saveRecordingWithName = (customFileName: string) => {
    if (tempBlob) {
      const mimeType = tempBlob.type || 'audio/webm';
      completeRecordingWithName(
        tempBlob,
        customFileName,
        mimeType,
        onRecordingComplete
      );
      setTempBlob(null);
    }
  };

  // Close dialog without saving custom name
  const closeNameDialog = () => {
    // If dialog is closed without a name, use the default name
    if (tempBlob) {
      saveRecordingWithName(defaultFileName);
    }
    setShowNameDialog(false);
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
    togglePlayPreview: handleTogglePlayPreview,
    showNameDialog,
    setShowNameDialog,
    saveRecordingWithName,
    closeNameDialog,
    defaultFileName
  };
};
