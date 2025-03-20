
import { useState, useEffect } from 'react';
import { MedicalSections } from '@/components/structured-output/types';

interface UseEditModeStateParams {
  lastSavedData: MedicalSections | null;
  applySavedDataToUI: () => void;
}

/**
 * Hook to manage edit mode state transitions
 */
export const useEditModeState = ({
  lastSavedData,
  applySavedDataToUI
}: UseEditModeStateParams) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [disableRefreshAfterSave] = useState(true);

  // Handle edit mode state transitions
  useEffect(() => {
    console.log('[useEditModeState] Effect triggered by isEditMode or lastSavedData change');
    console.log('[useEditModeState] Current isEditMode:', isEditMode);
    console.log('[useEditModeState] Has lastSavedData:', !!lastSavedData);
    
    // When exiting edit mode with saved data
    if (!isEditMode && lastSavedData) {
      console.log('[useEditModeState] Exiting edit mode with lastSavedData:', 
        JSON.stringify({
          hasPatientInfo: !!lastSavedData.patientInformation,
          medicationsCount: lastSavedData.medications ? 
            (Array.isArray(lastSavedData.medications) ? lastSavedData.medications.length : 'not array') : 
            'none',
          keys: Object.keys(lastSavedData)
        }));
      
      // Apply the saved data
      applySavedDataToUI();
    }
  }, [isEditMode, lastSavedData, applySavedDataToUI]);
  
  const toggleEditMode = () => {
    console.log(`[useEditModeState] Toggle edit mode from ${isEditMode} to ${!isEditMode}`);
    setIsEditMode(!isEditMode);
  };
  
  return {
    isEditMode,
    disableRefreshAfterSave,
    toggleEditMode
  };
};
