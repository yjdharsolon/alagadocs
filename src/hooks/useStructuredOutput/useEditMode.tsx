
import { useState, useCallback, useEffect } from 'react';
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
  const [lastSavedData, setLastSavedData] = useState<MedicalSections | null>(null);
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  console.log(`[useEditMode] Initialized with transcriptionId: ${transcriptionId}, patientId: ${patientId}`);

  const handleToggleEditMode = useCallback(() => {
    console.log(`[useEditMode] Toggle edit mode from ${isEditMode} to ${!isEditMode}`);
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode && lastSavedData) {
      console.log('[useEditMode] Exiting edit mode with lastSavedData:', 
        JSON.stringify({
          hasPatientInfo: !!lastSavedData.patientInformation,
          medicationsCount: lastSavedData.medications ? 
            (Array.isArray(lastSavedData.medications) ? lastSavedData.medications.length : 'not array') : 
            'none',
          keys: Object.keys(lastSavedData)
        }));
            
      setStructuredData(lastSavedData);
      setLastSavedData(null);
    }
  }, [isEditMode, lastSavedData, setStructuredData]);

  const handleSaveEdit = useCallback(async (updatedData: MedicalSections, stayInEditMode = false) => {
    console.log('[useEditMode] handleSaveEdit called with:', { 
      dataSize: Object.keys(updatedData).length,
      hasMedications: !!updatedData.medications,
      medicationsCount: updatedData.medications ? 
        (Array.isArray(updatedData.medications) ? updatedData.medications.length : 'not array') : 
        'none',
      stayInEditMode,
      transcriptionId,
      saveInProgress
    });
    
    if (saveInProgress) {
      console.log('[useEditMode] Save operation already in progress, skipping.');
      return;
    }
    
    setSaveInProgress(true);
    
    try {
      // Deep clone to avoid reference issues
      const dataToSave = JSON.parse(JSON.stringify(updatedData));
      
      console.log('[useEditMode] Data prepared for saving:', 
        JSON.stringify({
          hasMedications: !!dataToSave.medications,
          medicationsCount: dataToSave.medications ? 
            (Array.isArray(dataToSave.medications) ? dataToSave.medications.length : 'not array') : 
            'none'
        }));
      
      // Update UI state immediately
      setStructuredData(dataToSave);
      setLastSavedData(dataToSave);
      
      // Persist to database if possible
      if (transcriptionId && user?.id) {
        try {
          console.log('[useEditMode] Saving to database...');
          const saveResult = await saveStructuredNote(
            user.id,
            transcriptionId,
            dataToSave,
            patientId
          );
          console.log('[useEditMode] Save result:', saveResult);
          setNoteSaved(true);
          toast.success('Document saved to database successfully');
        } catch (error) {
          console.error('Error saving note to database:', error);
          toast.error('Failed to save document to database');
        }
      } else {
        console.log('[useEditMode] Not saving to database - missing transcriptionId or user.id');
      }
      
      if (!stayInEditMode) {
        console.log('[useEditMode] Exiting edit mode as requested');
        setIsEditMode(false);
      } else {
        console.log('[useEditMode] Staying in edit mode after save as requested');
      }
      
      toast.success('Document changes saved successfully');
    } catch (error) {
      console.error('[useEditMode] Error in save process:', error);
      toast.error('Error processing save request');
    } finally {
      setSaveInProgress(false);
    }
  }, [setStructuredData, transcriptionId, user, patientId, saveInProgress]);

  return {
    isEditMode,
    noteSaved,
    handleToggleEditMode,
    handleSaveEdit
  };
};
