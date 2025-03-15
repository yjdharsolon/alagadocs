
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  useFileHandling,
  useUploadProgress, 
  useUploadAuth,
  useUploadProcess
} from './index';

export const useUploadForm = (patientId?: string) => {
  const [error, setError] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Handle file input and recording
  const {
    file,
    isRecording,
    setIsRecording,
    handleFileSelect,
    handleRecordingComplete
  } = useFileHandling();
  
  // Handle authentication check
  const { sessionChecked, handleLogoutAndLogin } = useUploadAuth(
    user, 
    signOut, 
    setError
  );
  
  // Handle upload process
  const {
    isUploading,
    uploadProgress,
    currentStep,
    handleSubmit: processUpload,
    getStepLabel
  } = useUploadProcess(setError);
  
  // Wrap handleSubmit to include user and patientId
  const handleSubmit = useCallback(async () => {
    try {
      if (!sessionChecked) {
        throw new Error('Session not verified yet. Please wait.');
      }
      
      if (!file) {
        throw new Error('No file selected. Please upload or record audio first.');
      }
      
      return await processUpload(file, user, patientId);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    }
  }, [file, user, patientId, processUpload, sessionChecked]);
  
  // Function to change the selected patient
  const changePatient = useCallback(() => {
    navigate('/select-patient');
  }, [navigate]);
  
  // Return the combined state and handlers
  return {
    file,
    isUploading,
    isRecording,
    setIsRecording,
    uploadProgress,
    currentStep,
    error,
    sessionChecked,
    handleFileSelect,
    handleRecordingComplete,
    handleSubmit,
    getStepLabel,
    handleLogoutAndLogin,
    changePatient
  };
};
