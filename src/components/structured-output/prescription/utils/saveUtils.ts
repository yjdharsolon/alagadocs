
import { Medication, PatientInfo, PrescriberInfo } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';
import { toast } from 'sonner';

export const validateAndSavePrescription = (
  structuredData: MedicalSections,
  patientInfo: PatientInfo,
  medications: Medication[],
  prescriberInfo: PrescriberInfo,
  onSave: (updatedData: MedicalSections, stayInEditMode?: boolean) => void,
  stayInEditMode: boolean = false
): void => {
  try {
    // Validate required fields
    const missingFields = medications.some(med => !med.genericName);
    if (missingFields) {
      toast.warning("Some medications are missing required generic name");
    }
    
    console.log('[validateAndSavePrescription] Input medications:', JSON.stringify(medications, null, 2));
    console.log('[validateAndSavePrescription] stayInEditMode:', stayInEditMode);
    
    // Create a complete deep clone to avoid reference issues
    const clonedMedications = JSON.parse(JSON.stringify(medications));
    
    // Ensure cloned medications maintain all properties
    for (let i = 0; i < clonedMedications.length; i++) {
      // Ensure each medication has all required fields
      clonedMedications[i] = {
        id: clonedMedications[i].id || i + 1,
        genericName: clonedMedications[i].genericName || '',
        brandName: clonedMedications[i].brandName || '',
        strength: clonedMedications[i].strength || '',
        dosageForm: clonedMedications[i].dosageForm || '',
        sigInstructions: clonedMedications[i].sigInstructions || '',
        quantity: clonedMedications[i].quantity || '',
        refills: clonedMedications[i].refills || '',
        specialInstructions: clonedMedications[i].specialInstructions || ''
      };
    }
    
    // Prepare updated data with properly structured medications
    const updatedData: MedicalSections = {
      ...structuredData,
      patientInformation: { ...patientInfo },
      medications: clonedMedications,
      prescriberInformation: { ...prescriberInfo }
    };
    
    console.log("[validateAndSavePrescription] Final updatedData medications:", JSON.stringify(updatedData.medications, null, 2));
    
    // Pass the stayInEditMode flag to the callback so the parent can decide to stay in edit mode
    onSave(updatedData, stayInEditMode);
    
    const message = stayInEditMode ? "Prescription saved" : "Prescription submitted successfully";
    toast.success(message);
  } catch (error) {
    console.error('Error saving prescription:', error);
    toast.error("Failed to save prescription");
  }
};
