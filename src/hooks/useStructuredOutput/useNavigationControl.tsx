
import { useCallback, useState } from 'react';
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
  const [noteSaved, setNoteSaved] = useState(false);

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

  const handleNoteSaved = useCallback(() => {
    setNoteSaved(true);
  }, []);

  const handleEndConsult = useCallback(() => {
    navigate('/select-patient');
  }, [navigate]);

  return {
    handleBackClick,
    handleRetry,
    handleNoteSaved,
    handleEndConsult,
    noteSaved
  };
};
