
import { useUploadAuth } from './useUploadAuth';
import { useFileHandling } from './useFileHandling';
import { useUploadProcess } from './useUploadProcess';
import { useAuthenticationCheck } from './useAuthenticationCheck';
import { useUploadProgress } from './useUploadProgress';
import { useUploadError } from './useUploadError';

export const useUploadForm = (user: any, signOut: () => Promise<void>) => {
  const { 
    error, 
    sessionChecked, 
    handleLogoutAndLogin,
    setError
  } = useUploadAuth(user, signOut);

  const {
    file,
    isRecording,
    setIsRecording,
    handleFileSelect,
    handleRecordingComplete
  } = useFileHandling();

  const {
    isUploading,
    uploadProgress,
    currentStep,
    handleSubmit: processUpload,
    getStepLabel
  } = useUploadProcess(setError);

  // Combine the handleSubmit function with file and user
  const handleSubmit = () => {
    return processUpload(file, user);
  };

  // Return all the values and methods from the hooks
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

export * from './useUploadAuth';
export * from './useFileHandling';
export * from './useUploadProcess';
export * from './useAuthenticationCheck';
export * from './useUploadProgress';
export * from './useUploadError';
