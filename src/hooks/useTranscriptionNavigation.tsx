
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTranscriptionNavigation = () => {
  const navigate = useNavigate();
  
  const redirectToUpload = useCallback(() => {
    console.log('Redirecting to upload page');
    
    // Clean up session storage
    sessionStorage.removeItem('pendingTranscription');
    sessionStorage.removeItem('lastTranscriptionResult');
    
    // Show toast message and redirect
    toast.info('No transcription data found. Starting new upload.');
    navigate('/upload');
  }, [navigate]);
  
  const redirectToStructuredOutput = useCallback((data: any) => {
    navigate('/structured-output', { state: data });
  }, [navigate]);
  
  return {
    navigate,
    redirectToUpload,
    redirectToStructuredOutput
  };
};
