
import { useCallback } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { toast } from 'sonner';
import { useSafeDataUpdate } from './useSafeDataUpdate';
import { useDatabaseOperations } from './useDatabaseOperations';
import { useEditModeState } from './useEditModeState';

interface UseEditModeParams {
  setStructuredData: (data: MedicalSections) => void;
  transcriptionId?: string;
  patientId?: string | null;
}

export const useEditMode = ({ setStructuredData, transcriptionId, patientId }: UseEditModeParams) => {
  console.log(`[useEditMode] Initialized with transcriptionId: ${transcriptionId}, patientId: ${patientId}`);
  
  // Use the extracted sub-hooks
  const {
    noteSaved,
    lastSavedData,
    updateUIWithData,
    trackSavedData,
    applySavedDataToUI,
    setNoteSaved
  } = useSafeDataUpdate({ setStructuredData });
  
  const { saveInProgress, saveToDatabase } = useDatabaseOperations({ 
    transcriptionId, 
    patientId 
  });
  
  const { isEditMode, disableRefreshAfterSave, toggleEditMode } = useEditModeState({
    lastSavedData,
    applySavedDataToUI
  });
  
  // Prepare and save data
  const prepareDataForSave = (data: MedicalSections) => {
    // Create a completely independent deep clone that won't be affected by reference issues
    const dataToSave = JSON.parse(JSON.stringify(data));
    
    // Ensure medications are properly preserved if they exist
    if (dataToSave.medications && Array.isArray(dataToSave.medications)) {
      console.log('[useEditMode] Ensuring all medication properties are preserved');
      dataToSave.medications = dataToSave.medications.map((med: any, index: number) => ({
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
    
    return dataToSave;
  };
  
  // Main save handler
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
    
    try {
      // Prepare data for saving
      const dataToSave = prepareDataForSave(updatedData);
      
      // Update UI FIRST with a fresh clone of data
      updateUIWithData(dataToSave);
      
      // Track the saved data
      trackSavedData(dataToSave);
      
      // Save to database in the background
      saveToDatabase(dataToSave);
      
      // Handle edit mode state based on stayInEditMode flag
      if (!stayInEditMode) {
        console.log('[useEditMode] Exiting edit mode as requested');
        toggleEditMode();
      } else {
        console.log('[useEditMode] Staying in edit mode after save as requested');
      }
      
      toast.success('Document changes saved successfully');
    } catch (error) {
      console.error('[useEditMode] Error in save process:', error);
      toast.error('Error processing save request');
    }
  }, [
    updateUIWithData, 
    trackSavedData, 
    saveToDatabase, 
    toggleEditMode, 
    transcriptionId, 
    saveInProgress
  ]);

  // Public API
  return {
    isEditMode,
    noteSaved,
    disableRefreshAfterSave,
    handleToggleEditMode: toggleEditMode,
    handleSaveEdit
  };
};
