
import { useState, useCallback } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { toast } from 'sonner';
import { saveStructuredNote } from '@/services/structuredNote/saveNote';
import { useAuth } from '@/hooks/useAuth';

interface UseEditModeParams {
  setStructuredData: (data: MedicalSections) => void;
  transcriptionId?: string;
  patientId?: string | null;
}

export const useEditMode = ({ setStructuredData, transcriptionId, patientId }: UseEditModeParams) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();
  const [noteSaved, setNoteSaved] = useState(false);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleSaveEdit = useCallback(async (updatedData: MedicalSections, stayInEditMode = false) => {
    console.log('[useEditMode] handleSaveEdit called with:', { 
      dataSize: Object.keys(updatedData).length,
      hasMedications: !!updatedData.medications,
      medicationsCount: updatedData.medications ? 
        (Array.isArray(updatedData.medications) ? updatedData.medications.length : 'not array') : 
        'none',
      stayInEditMode,
      transcriptionId
    });
    
    // Ensure medications are preserved exactly as provided without normalization
    const dataToSave = {
      ...updatedData,
      // Make sure medications array is preserved as-is without any transformation
      medications: updatedData.medications
    };
    
    // First update the data - this will trigger re-renders with the new data
    setStructuredData(dataToSave);
    
    // Save to database if we have a transcription ID and user
    if (transcriptionId && user?.id) {
      try {
        await saveStructuredNote(
          user.id,
          transcriptionId,
          dataToSave,
          patientId
        );
        setNoteSaved(true);
        toast.success('Document saved to database successfully');
      } catch (error) {
        console.error('Error saving note to database:', error);
        toast.error('Failed to save document to database');
      }
    }
    
    // Only exit edit mode if stayInEditMode is false
    if (!stayInEditMode) {
      console.log('[useEditMode] Exiting edit mode as requested');
      setIsEditMode(false);
    } else {
      console.log('[useEditMode] Staying in edit mode after save as requested');
    }
    
    toast.success('Document changes saved successfully');
  }, [setStructuredData, transcriptionId, user, patientId]);

  return {
    isEditMode,
    noteSaved,
    handleToggleEditMode,
    handleSaveEdit
  };
};
