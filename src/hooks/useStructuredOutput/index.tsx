
import { useNavigationControl } from './useNavigationControl';
import { useEditMode } from './useEditMode';
import { useErrorHandling } from './useErrorHandling';
import { MedicalSections } from '@/components/structured-output/types';

interface UseStructuredOutputPageParams {
  structuredData: MedicalSections | null;
  setStructuredData: (data: MedicalSections) => void;
  transcriptionData: any;
  audioUrl?: string;
  error: string | null;
}

export const useStructuredOutputPage = ({
  structuredData,
  setStructuredData,
  transcriptionData,
  audioUrl,
  error
}: UseStructuredOutputPageParams) => {
  // Use the navigation hook
  const { 
    handleBackClick, 
    handleRetry 
  } = useNavigationControl({ 
    transcriptionData, 
    audioUrl 
  });

  // Use the edit mode hook
  const { 
    isEditMode, 
    handleToggleEditMode, 
    handleSaveEdit 
  } = useEditMode({ 
    setStructuredData 
  });

  // Use the error handling hook
  const { 
    retryProcessing 
  } = useErrorHandling({ 
    error, 
    handleRetry 
  });

  return {
    isEditMode,
    handleBackClick,
    handleToggleEditMode,
    handleSaveEdit,
    handleRetry: retryProcessing
  };
};
