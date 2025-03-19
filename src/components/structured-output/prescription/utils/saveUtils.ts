
import { Medication, PatientInfo, PrescriberInfo } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';
import { toast } from 'sonner';

export const validateAndSavePrescription = (
  structuredData: MedicalSections,
  patientInfo: PatientInfo,
  medications: Medication[],
  prescriberInfo: PrescriberInfo,
  onSave: (updatedData: MedicalSections) => void
): void => {
  try {
    // Validate required fields
    const missingFields = medications.some(med => !med.genericName);
    if (missingFields) {
      toast.warning("Some medications are missing required generic name");
    }
    
    // Prepare updated data with properly structured medications
    const updatedData: MedicalSections = {
      ...structuredData,
      patientInformation: patientInfo,
      medications: medications.map(med => ({
        ...med,
        // Ensure both name and genericName are set for backward compatibility
        name: med.genericName, // Set name field to match genericName for backward compatibility
      })),
      prescriberInformation: prescriberInfo
    };
    
    console.log("Saving prescription with medications:", updatedData.medications);
    onSave(updatedData);
  } catch (error) {
    console.error('Error saving prescription:', error);
    toast.error("Failed to save prescription");
  }
};
