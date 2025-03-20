
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { toast } from 'sonner';

interface UseSafeDataUpdateParams {
  setStructuredData: (data: MedicalSections) => void;
}

/**
 * Hook to safely update structured data with tracking
 */
export const useSafeDataUpdate = ({ setStructuredData }: UseSafeDataUpdateParams) => {
  const [lastSavedData, setLastSavedData] = useState<MedicalSections | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  
  /**
   * Safe update function that clones data to avoid reference issues
   */
  const updateUIWithData = (data: MedicalSections) => {
    console.log('[useSafeDataUpdate] Updating UI with data:', JSON.stringify({
      hasPatientInfo: !!data.patientInformation,
      medicationsCount: data.medications ? 
        (Array.isArray(data.medications) ? data.medications.length : 'not array') : 
        'none',
      keys: Object.keys(data)
    }));
    
    // Deep clone to avoid reference issues before updating the UI
    const safeData = JSON.parse(JSON.stringify(data));
    setStructuredData(safeData);
  };
  
  /**
   * Track saved data and UI state for future reference
   */
  const trackSavedData = (data: MedicalSections) => {
    // Store a clean deep clone of the saved data
    const safeClone = JSON.parse(JSON.stringify(data));
    setLastSavedData(safeClone);
    setNoteSaved(true);
    
    console.log('[useSafeDataUpdate] Data tracked as saved');
  };
  
  /**
   * Apply saved data to UI when exiting edit mode
   */
  const applySavedDataToUI = () => {
    if (lastSavedData) {
      console.log('[useSafeDataUpdate] Applying saved data to UI');
      updateUIWithData(lastSavedData);
      setLastSavedData(null);
    }
  };
  
  return {
    noteSaved,
    lastSavedData,
    updateUIWithData,
    trackSavedData,
    applySavedDataToUI,
    setNoteSaved
  };
};
