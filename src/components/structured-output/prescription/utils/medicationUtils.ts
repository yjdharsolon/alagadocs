
import { Medication } from '../types/prescriptionTypes';
import { toast } from 'sonner';

// Handle medication changes with improved error handling and debugging
export const handleMedicationChange = (
  medications: Medication[],
  index: number, 
  field: keyof Medication, 
  value: string
): Medication[] => {
  try {
    if (index < 0 || index >= medications.length) {
      console.error(`Invalid medication index: ${index}`);
      return medications;
    }
    
    // Create a deep copy of the medication being updated
    const updatedMedication = {
      ...medications[index],
      [field]: value
    };
    
    // Create a new array with the updated medication
    const updatedMedications = [
      ...medications.slice(0, index),
      updatedMedication,
      ...medications.slice(index + 1)
    ];
    
    // Debug logging for medication changes
    console.log(`Updated medication field '${field}' at index ${index} to: "${value}"`);
    console.log('Medication after update:', JSON.stringify(updatedMedication, null, 2));
    
    return updatedMedications;
  } catch (error) {
    console.error(`Error updating medication field '${field}':`, error);
    toast.error("Error updating medication information");
    return medications;
  }
};

// Add a new medication at the top of the list
export const addMedication = (medications: Medication[]): Medication[] => {
  try {
    // Create new medication with next ID
    const newMedication = {
      id: medications.length > 0 ? Math.max(...medications.map(med => med.id || 0)) + 1 : 1,
      genericName: '',
      brandName: '',
      strength: '',
      dosageForm: '',
      sigInstructions: '',
      quantity: '',
      refills: '',
      specialInstructions: ''
    };
    
    // Add new medication at the beginning of the array
    const updatedMedications = [newMedication, ...medications];
    console.log('Added new medication:', JSON.stringify(newMedication, null, 2));
    console.log('Updated medications array after add:', JSON.stringify(updatedMedications, null, 2));
    
    return updatedMedications;
  } catch (error) {
    console.error('Error adding new medication:', error);
    toast.error("Failed to add new medication");
    return medications;
  }
};

// Remove a medication with improved error handling
export const removeMedication = (medications: Medication[], index: number): Medication[] => {
  try {
    if (index < 0 || index >= medications.length) {
      console.error(`Invalid medication index for removal: ${index}`);
      return medications;
    }
    
    // Create a new array without the medication to remove
    const updatedMedications = [
      ...medications.slice(0, index),
      ...medications.slice(index + 1)
    ].map((med, idx) => ({
      ...med,
      id: idx + 1
    }));
    
    console.log(`Removed medication at index ${index}`);
    console.log('Updated medications array after removal:', JSON.stringify(updatedMedications, null, 2));
    
    return updatedMedications;
  } catch (error) {
    console.error('Error removing medication:', error);
    toast.error("Failed to remove medication");
    return medications;
  }
};

// Initialize medications array from structured data with proper handling
export const initializeMedications = (medications: any): Medication[] => {
  try {
    if (!medications) {
      return [];
    }
    
    if (Array.isArray(medications)) {
      console.log('Initializing medications from array:', JSON.stringify(medications, null, 2));
      return medications.map((med, index) => {
        // For string values, create a basic medication object
        if (typeof med === 'string') {
          return {
            id: index + 1,
            genericName: med,
            brandName: '',
            strength: '',
            dosageForm: '',
            sigInstructions: '',
            quantity: '',
            refills: '',
            specialInstructions: ''
          };
        }
        
        // For existing medication objects, preserve all fields exactly as they are
        return {
          id: med.id || index + 1,
          genericName: med.genericName || med.name || '',
          brandName: med.brandName || '',
          strength: med.strength || '',
          dosageForm: med.dosageForm || '',
          sigInstructions: med.sigInstructions || '',
          quantity: med.quantity || '',
          refills: med.refills || '',
          specialInstructions: med.specialInstructions || ''
        };
      });
    } else if (typeof medications === 'string') {
      // Handle case where medications might be a string
      console.warn('Medications provided as string instead of array:', medications);
      return [{
        id: 1,
        genericName: medications,
        brandName: '',
        strength: '',
        dosageForm: '',
        sigInstructions: '',
        quantity: '',
        refills: '',
        specialInstructions: ''
      }];
    }
  } catch (error) {
    console.error('Error initializing medications:', error);
  }
  
  return [];
};
