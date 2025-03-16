
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTranscriptionNavigation = () => {
  const navigate = useNavigate();
  
  const redirectToUpload = useCallback((delay = 1500) => {
    toast.error('No transcription data found');
    setTimeout(() => navigate('/upload'), delay);
  }, [navigate]);
  
  const redirectToStructured = useCallback((data: any) => {
    navigate('/structured-output', { state: data });
  }, [navigate]);
  
  return {
    navigate,
    redirectToUpload,
    redirectToStructured
  };
};
