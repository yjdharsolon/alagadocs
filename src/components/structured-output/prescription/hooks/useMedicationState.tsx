
import { useState, useEffect } from 'react';
import { Medication } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';
import { 
  handleMedicationChange, 
  addMedication, 
  removeMedication,
  initializeMedications
} from '../utils/medicationUtils';

/**
 * Hook for managing medications state in the prescription editor
 */
export const useMedicationState = (structuredData: MedicalSections) => {
  // Initialize medications with improved error handling
  const [medications, setMedications] = useState<Medication[]>(() => {
    const initialMedications = initializeMedications(structuredData.medications);
    console.log('[useMedicationState] Initial medications state:', JSON.stringify(initialMedications, null, 2));
    return initialMedications;
  });

  // Update medications when structuredData changes and medications aren't empty
  useEffect(() => {
    if (structuredData.medications && 
        Array.isArray(structuredData.medications) && 
        structuredData.medications.length > 0) {
      console.log('[useMedicationState] Updating medications from structuredData:', 
        JSON.stringify(structuredData.medications, null, 2));
      
      const initialMedications = initializeMedications(structuredData.medications);
      setMedications(initialMedications);
    }
  }, [structuredData.medications]);

  // Hook up medication utility functions to state with improved logging
  const handleMedicationChangeState = (index: number, field: keyof Medication, value: string) => {
    console.log(`[useMedicationState] Medication change requested - Index: ${index}, Field: ${field}, Value: ${value}`);
    
    const updatedMedications = handleMedicationChange(medications, index, field, value);
    console.log('[useMedicationState] Setting medications state with:', JSON.stringify(updatedMedications, null, 2));
    
    setMedications(updatedMedications);
  };
  
  const handleAddMedication = () => {
    console.log('[useMedicationState] Adding new medication');
    const updatedMedications = addMedication(medications);
    setMedications(updatedMedications);
  };
  
  const handleRemoveMedication = (index: number) => {
    console.log(`[useMedicationState] Removing medication at index ${index}`);
    const updatedMedications = removeMedication(medications, index);
    setMedications(updatedMedications);
  };

  return {
    medications,
    setMedications,
    handleMedicationChangeState,
    handleAddMedication,
    handleRemoveMedication
  };
};
