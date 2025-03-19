
import { useState, useCallback } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { toast } from 'sonner';

interface UseEditModeParams {
  setStructuredData: (data: MedicalSections) => void;
}

export const useEditMode = ({ setStructuredData }: UseEditModeParams) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleSaveEdit = useCallback((updatedData: MedicalSections, stayInEditMode = false) => {
    setStructuredData(updatedData);
    
    // Only exit edit mode if stayInEditMode is false
    if (!stayInEditMode) {
      setIsEditMode(false);
    }
    
    toast.success('Document changes saved successfully');
  }, [setStructuredData]);

  return {
    isEditMode,
    handleToggleEditMode,
    handleSaveEdit
  };
};
