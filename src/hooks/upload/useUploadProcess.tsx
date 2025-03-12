
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
      
      // Verify and refresh the authentication session if needed - do this in parallel
      const sessionPromise = verifyAndRefreshSession();
      
      updateProgressForUpload();
      
      console.log('Starting audio upload process with file:', file.name);
      
      // Upload the audio file to Supabase storage
      const audioUrl = await uploadAudio(file);
      
      // Ensure session is verified before proceeding
      await sessionPromise;
      
      console.log('Audio successfully uploaded:', audioUrl);
      
      // Create early navigation data with pending state
      const pendingData = {
        audioUrl,
        status: 'transcribing',
        transcriptionId: Date.now().toString()
      };
      
      // Store this data for recovery
      sessionStorage.setItem('pendingTranscription', JSON.stringify(pendingData));
      
      // Force navigation to edit-transcript with pending state
      console.log('Navigating to edit-transcript with pending state');
      
      // Use window.location.href for a full redirect instead of navigate
      // This ensures a complete page transition
      window.location.href = '/edit-transcript?pending=true';
      
      // Continue with transcription in the background
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

      // Update the session storage with completed data
      sessionStorage.setItem('lastTranscriptionResult', JSON.stringify(result));
      
      // Signal completion to edit-transcript page via sessionStorage
      sessionStorage.setItem('transcriptionComplete', 'true');
      
      // Reset state after transcription is complete
      setIsUploading(false);
      resetProgress();
      
      return result;
    } catch (error) {
      console.error('Error in upload process:', error);
      // Cleanup any pending state in case of error
      sessionStorage.removeItem('pendingTranscription');
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
