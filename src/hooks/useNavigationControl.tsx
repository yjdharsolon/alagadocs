
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseNavigationControlParams {
  isEditMode: boolean;
  onCancelEdit: () => void;
  transcriptionData?: any;
  audioUrl?: string;
}

export const useNavigationControl = ({
  isEditMode,
  onCancelEdit,
  transcriptionData,
  audioUrl
}: UseNavigationControlParams) => {
  const navigate = useNavigate();
  const [noteSaved, setNoteSaved] = useState(false);

  const handleBackClick = useCallback(() => {
    // If in edit mode, cancel edit first
    if (isEditMode) {
      onCancelEdit();
      return;
    }

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
  }, [navigate, transcriptionData, audioUrl, isEditMode, onCancelEdit]);

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
    console.log('Note marked as saved');
    setNoteSaved(true);
  }, []);

  const handleEndConsult = useCallback(() => {
    // Ensure we navigate to the patient selection page
    console.log('End consultation clicked, navigating to /select-patient');
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
