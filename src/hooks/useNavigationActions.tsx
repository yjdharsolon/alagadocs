
import { useNavigate } from 'react-router-dom';

interface UseNavigationActionsParams {
  transcriptionData: any;
  transcriptionId: string;
  audioUrl?: string;
  structuredData: any;
}

export const useNavigationActions = ({
  transcriptionData,
  transcriptionId,
  audioUrl,
  structuredData
}: UseNavigationActionsParams) => {
  const navigate = useNavigate();
  
  const handleBackToTranscription = () => {
    navigate('/transcribe', { 
      state: { 
        transcriptionData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        structuredData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
  return {
    navigate,
    handleBackToTranscription,
    handleEdit
  };
};
