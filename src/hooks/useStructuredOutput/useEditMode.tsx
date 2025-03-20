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
  const [disableRefreshAfterSave, setDisableRefreshAfterSave] = useState(false);
  
  console.log(`[useEditMode] Initialized with transcriptionId: ${transcriptionId}, patientId: ${patientId}`);
  console.log('[useEditMode] Initial lastSavedData state:', lastSavedData ? 'has data' : 'null');

  const handleToggleEditMode = useCallback(() => {
    console.log(`[useEditMode] Toggle edit mode from ${isEditMode} to ${!isEditMode}`);
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  useEffect(() => {
    console.log('[useEditMode] Effect triggered by isEditMode or lastSavedData change');
    console.log('[useEditMode] Current isEditMode:', isEditMode);
    console.log('[useEditMode] Has lastSavedData:', !!lastSavedData);
    
    if (!isEditMode && lastSavedData) {
      console.log('[useEditMode] Exiting edit mode with lastSavedData:', 
        JSON.stringify({
          hasPatientInfo: !!lastSavedData.patientInformation,
          medicationsCount: lastSavedData.medications ? 
            (Array.isArray(lastSavedData.medications) ? lastSavedData.medications.length : 'not array') : 
            'none',
          keys: Object.keys(lastSavedData)
        }));
      
      if (lastSavedData.medications) {
        console.log('[useEditMode] Medications in lastSavedData when exiting edit mode:', 
          Array.isArray(lastSavedData.medications) ? 
            JSON.stringify(lastSavedData.medications, null, 2) : lastSavedData.medications);
      }
            
      // Apply the saved data to the UI
      setStructuredData(lastSavedData);
      
      // Only clear lastSavedData if we've successfully passed it to setStructuredData
      console.log('[useEditMode] Clearing lastSavedData after applying to structuredData');
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
    
    if (updatedData.medications && Array.isArray(updatedData.medications)) {
      console.log('[useEditMode] Medications in updatedData:', JSON.stringify(updatedData.medications, null, 2));
    }
    
    // Record call stack to identify who called handleSaveEdit
    console.log('[useEditMode] handleSaveEdit call stack:', new Error().stack);
    
    if (saveInProgress) {
      console.log('[useEditMode] Save operation already in progress, skipping.');
      return;
    }
    
    // Set flag to disable refresh after save temporarily
    setDisableRefreshAfterSave(true);
    
    setSaveInProgress(true);
    
    try {
      // Create a completely independent deep clone that won't be affected by reference issues
      const dataToSave = JSON.parse(JSON.stringify(updatedData));
      
      // Ensure medications are properly preserved if they exist
      if (dataToSave.medications && Array.isArray(dataToSave.medications)) {
        console.log('[useEditMode] Ensuring all medication properties are preserved');
        dataToSave.medications = dataToSave.medications.map((med, index) => ({
          id: med.id || index + 1,
          genericName: med.genericName || '',
          brandName: med.brandName || '',
          strength: med.strength || '',
          dosageForm: med.dosageForm || '',
          sigInstructions: med.sigInstructions || '',
          quantity: med.quantity || '',
          refills: med.refills || '',
          specialInstructions: med.specialInstructions || ''
        }));
      }
      
      console.log('[useEditMode] Data prepared for saving:', 
        JSON.stringify({
          hasMedications: !!dataToSave.medications,
          medicationsCount: dataToSave.medications ? 
            (Array.isArray(dataToSave.medications) ? dataToSave.medications.length : 'not array') : 
            'none'
        }));
      
      if (dataToSave.medications && Array.isArray(dataToSave.medications)) {
        console.log('[useEditMode] Cloned medications for saving:', JSON.stringify(dataToSave.medications, null, 2));
      }
      
      // Update UI state FIRST with a fresh clone of data
      const uiData = JSON.parse(JSON.stringify(dataToSave));
      setStructuredData(uiData);
      
      // Keep track of the edited data for when edit mode is toggled off
      setLastSavedData(dataToSave);
      console.log('[useEditMode] Updated lastSavedData with cloned data');
      
      // Set note as saved to update UI state
      setNoteSaved(true);
      
      // Persist to database if possible - But don't wait for it to complete
      if (transcriptionId && user?.id) {
        try {
          console.log('[useEditMode] Starting database save (in background)...');
          
          // Use a setTimeout to ensure UI updates happen first
          setTimeout(async () => {
            try {
              const saveResult = await saveStructuredNote(
                user.id,
                transcriptionId,
                dataToSave,
                patientId
              );
              console.log('[useEditMode] Background save result:', saveResult);
              toast.success('Document saved to database successfully');
            } catch (error) {
              console.error('Error in background save:', error);
              toast.error('Warning: Changes saved to screen but database update failed');
            }
          }, 0);
        } catch (error) {
          console.error('Error setting up background save:', error);
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
      
      // Reset the refresh disable flag after a short delay
      // to ensure the data is properly saved before allowing refreshes
      setTimeout(() => {
        console.log('[useEditMode] Re-enabling data refresh after save');
        setDisableRefreshAfterSave(false);
      }, 2000); // Increased timeout to ensure UI is fully updated
    }
  }, [setStructuredData, transcriptionId, user, patientId, saveInProgress]);

  return {
    isEditMode,
    noteSaved,
    disableRefreshAfterSave,
    handleToggleEditMode,
    handleSaveEdit
  };
};
