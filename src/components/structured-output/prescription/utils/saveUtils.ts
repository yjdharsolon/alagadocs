
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
    
    // Prepare updated data with properly structured medications
    // IMPORTANT: We're now preserving ALL fields without any transformation
    const updatedData: MedicalSections = {
      ...structuredData,
      patientInformation: patientInfo,
      medications: medications, // Store the array directly without any transformation
      prescriberInformation: prescriberInfo
    };
    
    console.log("[validateAndSavePrescription] Final updatedData structure:", JSON.stringify({
      hasPatientInfo: !!updatedData.patientInformation,
      medicationsCount: Array.isArray(updatedData.medications) ? updatedData.medications.length : 'not array',
      hasPrescriberInfo: !!updatedData.prescriberInformation,
      otherKeys: Object.keys(updatedData).filter(k => 
        !['patientInformation', 'medications', 'prescriberInformation'].includes(k))
    }));
    
    console.log("[validateAndSavePrescription] Final updatedData.medications:", JSON.stringify(updatedData.medications, null, 2));
    
    // Pass the stayInEditMode flag to the callback so the parent can decide to stay in edit mode
    console.log("[validateAndSavePrescription] Calling onSave with stayInEditMode:", stayInEditMode);
    onSave(updatedData, stayInEditMode);
    
    const message = stayInEditMode ? "Prescription saved" : "Prescription submitted successfully";
    toast.success(message);
  } catch (error) {
    console.error('Error saving prescription:', error);
    toast.error("Failed to save prescription");
  }
};
