
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseNavigationControlParams {
  transcriptionData: any;
  audioUrl?: string;
}

export const useNavigationControl = ({
  transcriptionData,
  audioUrl
}: UseNavigationControlParams) => {
  const navigate = useNavigate();

  const handleBackClick = useCallback(() => {
    if (transcriptionData) {
      navigate('/edit-transcript', { 
        state: { 
          transcriptionData,
          audioUrl 
        } 
      });
    } else {
      navigate('/select-patient');
    }
  }, [navigate, transcriptionData, audioUrl]);

  const handleRetry = useCallback(() => {
    if (!transcriptionData || !transcriptionData.text) {
      return false;
    }
    
    // Redirect to transcription page to try again
    navigate('/transcribe', { 
      state: { 
        transcriptionData,
        audioUrl 
      } 
    });
    return true;
  }, [navigate, transcriptionData, audioUrl]);

  return {
    handleBackClick,
    handleRetry
  };
};
