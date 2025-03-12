
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { uploadAudio, transcribeAudio } from '@/services/audio';
import { useAuthenticationCheck } from './useAuthenticationCheck';
import { useUploadProgress } from './useUploadProgress';
import { useUploadError } from './useUploadError';

export const useUploadProcess = (setError: (error: string | null) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  
  const { verifyAndRefreshSession } = useAuthenticationCheck();
  const { 
    uploadProgress, 
    currentStep, 
    startProgressTracking, 
    updateProgressForUpload,
    updateProgressForTranscription,
    completeProgress,
    resetProgress,
    getStepLabel 
  } = useUploadProgress();
  const { handleUploadError } = useUploadError(setError);

  // We'll make this a useCallback to ensure stability
  const handleSubmit = useCallback(async (file: File | null, user: any) => {
    if (!file) {
      toast.error('Please upload or record an audio file first');
      return null;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to upload audio');
      navigate('/login');
      return null;
    }

    try {
      console.log('Starting upload process...');
      setIsUploading(true);
      setError(null);
      
      const isSimulation = file.name.includes('simulation-recording');
      
      // Start tracking progress and get the interval reference
      const progressInterval = startProgressTracking(isSimulation);
      
      // Verify and refresh the authentication session if needed
      await verifyAndRefreshSession();
      
      updateProgressForUpload();
      
      console.log('Starting audio upload process with file:', file.name);
      
      // Upload the audio file to Supabase storage
      const audioUrl = await uploadAudio(file);
      
      console.log('Audio successfully uploaded:', audioUrl);
      
      clearInterval(progressInterval);
      updateProgressForTranscription();
      
      // Transcribe the audio
      const transcriptionData = await transcribeAudio(audioUrl);
      
      console.log('Transcription completed successfully');
      completeProgress();
      
      toast.success('Transcription completed successfully');
      
      // For the unified flow, return the data including duration
      const transcriptionId = Date.now().toString(); // Temporary ID for demo
      
      const result = {
        transcriptionData,
        audioUrl,
        transcriptionId,
        duration: transcriptionData.duration || null
      };

      // Critical: store the result in sessionStorage as a backup
      try {
        sessionStorage.setItem('lastTranscriptionResult', JSON.stringify(result));
      } catch (err) {
        console.warn('Could not store transcription in sessionStorage:', err);
      }

      // Reset state before navigation to prevent UI issues
      setIsUploading(false);
      resetProgress();
      
      // Immediately attempt navigation with a small delay to ensure React state updates
      console.log('Attempting to navigate to edit-transcript with data:', result);
      
      // Use a more direct navigation approach with minimal delay
      setTimeout(() => {
        navigate('/edit-transcript', { 
          state: result,
          replace: false 
        });
      }, 100); // Minimal delay for reliable navigation
      
      return result;
    } catch (error) {
      console.error('Error in upload process:', error);
      return handleUploadError(error);
    } finally {
      console.log('Upload process completed, resetting state');
      setIsUploading(false);
      resetProgress();
    }
  }, [navigate, resetProgress, setError, completeProgress, updateProgressForTranscription, 
     updateProgressForUpload, startProgressTracking, verifyAndRefreshSession, handleUploadError]);

  return {
    isUploading,
    uploadProgress,
    currentStep,
    handleSubmit,
    getStepLabel
  };
};
