
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
    console.log('[useEditMode] handleSaveEdit called with:', { 
      dataSize: Object.keys(updatedData).length,
      hasMedications: !!updatedData.medications,
      medicationsCount: updatedData.medications ? 
        (Array.isArray(updatedData.medications) ? updatedData.medications.length : 'not array') : 
        'none',
      stayInEditMode 
    });
    
    // First update the data - this will trigger re-renders with the new data
    setStructuredData(updatedData);
    
    // Only exit edit mode if stayInEditMode is false
    if (!stayInEditMode) {
      console.log('[useEditMode] Exiting edit mode as requested');
      setIsEditMode(false);
    } else {
      console.log('[useEditMode] Staying in edit mode after save as requested');
    }
    
    toast.success('Document changes saved successfully');
  }, [setStructuredData]);

  return {
    isEditMode,
    handleToggleEditMode,
    handleSaveEdit
  };
};
