
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook to handle upload and transcription errors
 * @param setErrorCallback Function to set error state
 * @returns Object containing error handler function
 */
export const useUploadError = (setErrorCallback: (error: string | null) => void) => {
  const navigate = useNavigate();

  /**
   * Handles errors that occur during the upload or transcription process
   * @param error The error object or message
   * @returns null to indicate the process failed
   */
  const handleUploadError = (error: unknown) => {
    console.error('Error in upload process:', error);
    
    // Parse the error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Handle authentication errors specifically
    if (errorMessage.includes('Authentication error') || 
        errorMessage.includes('not authenticated') ||
        errorMessage.includes('JWT expired')) {
      setErrorCallback('Authentication error. Please log in again.');
      toast.error('Authentication error. Please log in again.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return null;
    }
    
    // Handle RLS policy errors
    if (errorMessage.includes('row-level security policy') || 
        errorMessage.includes('Permission error') ||
        errorMessage.includes('permission denied')) {
      setErrorCallback('Permission error. Please try logging out and logging back in.');
      toast.error('Permission error detected. This is often fixed by logging out and back in again.');
      return null;
    }
    
    // Handle storage-related errors
    if (errorMessage.includes('storage') || 
        errorMessage.includes('bucket') || 
        errorMessage.includes('upload')) {
      setErrorCallback('Error uploading audio file. Please check your connection and try again.');
      toast.error('Error uploading audio file. Please try again.');
      return null;
    }
    
    // Handle transcription-specific errors
    if (errorMessage.includes('transcription') || 
        errorMessage.includes('OpenAI') || 
        errorMessage.includes('Whisper')) {
      setErrorCallback('Error transcribing audio. The service might be temporarily unavailable.');
      toast.error('Error transcribing audio. Please try again later.');
      return null;
    }
    
    // Default error handling
    setErrorCallback(errorMessage || 'Error uploading audio. Please try again.');
    toast.error('Error processing your request. Please try again.');
    return null;
  };

  return {
    handleUploadError
  };
};
