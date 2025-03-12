
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUploadError = (setErrorCallback: (error: string | null) => void) => {
  const navigate = useNavigate();

  const handleUploadError = (error: unknown) => {
    console.error('Error in upload process:', error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Authentication error')) {
      setErrorCallback('Authentication error. Please log in again.');
      toast.error('Authentication error. Please log in again.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return null;
    }
    
    // Handle RLS policy errors
    if (error instanceof Error && 
        (error.message.includes('row-level security policy') || 
        error.message.includes('Permission error'))) {
      setErrorCallback('Permission error. Please try logging out and logging back in.');
      toast.error('Permission error detected. This is often fixed by logging out and back in again.');
      return null;
    }
    
    setErrorCallback(error instanceof Error ? error.message : 'Error uploading audio. Please try again.');
    toast.error('Error uploading audio. Please try again.');
    return null;
  };

  return {
    handleUploadError
  };
};
