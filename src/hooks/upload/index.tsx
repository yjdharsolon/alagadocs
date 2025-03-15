
import { useEffect, useState } from 'react';
import { useUploadAuth } from './useUploadAuth';
import { useFileHandling } from './useFileHandling';
import { useUploadProcess } from './useUploadProcess';

export const useUploadForm = (user: any, signOut: () => Promise<void>, patientId?: string | null) => {
  const [error, setError] = useState<string | null>(null);
  const [shouldResetFile, setShouldResetFile] = useState(false);
  
  // Authentication handling
  const {
    sessionChecked,
    handleLogoutAndLogin,
  } = useUploadAuth(user, signOut, setError);
  
  // File handling
  const {
    file,
    isRecording,
    setIsRecording,
    handleFileSelect,
    handleRecordingComplete,
  } = useFileHandling();
  
  // Upload process
  const {
    isUploading,
    uploadProgress,
    currentStep,
    handleSubmit: processUpload,
    getStepLabel
  } = useUploadProcess(setError);
  
  // Reset file when needed
  useEffect(() => {
    if (shouldResetFile) {
      handleFileSelect(null as any); // This will reset the file
      setShouldResetFile(false);
    }
  }, [shouldResetFile, handleFileSelect]);
  
  // Clear any errors when component mounts/unmounts
  useEffect(() => {
    setError(null);
    return () => setError(null);
  }, []);
  
  // Main submit handler that brings everything together
  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file or record audio first');
      return null;
    }
    
    if (!user) {
      setError('You must be logged in to upload audio');
      return null;
    }
    
    const result = await processUpload(file, user, patientId || undefined);
    
    // Request file reset after successful upload
    setShouldResetFile(true);
    
    return result;
  };
  
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
    handleLogoutAndLogin,
    handleSubmit,
    getStepLabel
  };
};
