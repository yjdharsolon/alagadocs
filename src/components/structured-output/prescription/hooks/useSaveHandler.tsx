
import { useState } from 'react';
import { Medication, PatientInfo, PrescriberInfo } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';
import { validateAndSavePrescription } from '../utils/saveUtils';
import { toast } from 'sonner';

/**
 * Hook for handling save actions in the prescription editor
 */
export const useSaveHandler = (
  structuredData: MedicalSections,
  patientInfo: PatientInfo,
  medications: Medication[],
  prescriberInfo: PrescriberInfo,
  onSave: (updatedData: MedicalSections, stayInEditMode?: boolean) => void,
  updateDataDirectly?: (data: MedicalSections) => void
) => {
  const [stayInEditMode, setStayInEditMode] = useState(true);

  // Toggle whether to stay in edit mode after saving
  const toggleStayInEditMode = () => {
    setStayInEditMode(prev => !prev);
    toast.info(stayInEditMode ? "Will exit editor after saving" : "Will stay in editor after saving");
  };

  // Handle form submission with validation using our utility
  const handleSave = (forceStayInEditMode?: boolean) => {
    console.log('[useSaveHandler] handleSave called with forceStayInEditMode:', forceStayInEditMode);
    console.log('[useSaveHandler] Current medications being saved:', JSON.stringify(medications, null, 2));
    
    // Use forceStayInEditMode if provided, otherwise use the stayInEditMode state
    const shouldStayInEditMode = forceStayInEditMode !== undefined ? forceStayInEditMode : stayInEditMode;
    
    // CRITICAL: Make a deep copy of medications to avoid reference issues
    const medicationsCopy = medications.map((med, index) => ({
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
    
    // CRITICAL: Always update UI directly first before any other operations
    if (updateDataDirectly) {
      console.log('[useSaveHandler] Directly updating UI with prescription data');
      
      // Prepare a complete data object with everything needed
      const directUpdateData: MedicalSections = {
        ...structuredData,
        patientInformation: { ...patientInfo },
        medications: JSON.parse(JSON.stringify(medicationsCopy)), // Extra deep clone for safety
        prescriberInformation: { ...prescriberInfo }
      };
      
      // Update UI state immediately
      updateDataDirectly(directUpdateData);
    }
    
    // Now handle the regular save flow with known-good copies of the data
    validateAndSavePrescription(
      structuredData,
      patientInfo,
      medicationsCopy, // Use our safe copy
      prescriberInfo,
      onSave,
      shouldStayInEditMode
    );
  };

  return {
    stayInEditMode,
    toggleStayInEditMode,
    handleSave
  };
};
