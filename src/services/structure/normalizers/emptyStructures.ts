
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Returns an appropriate empty structure based on format
 */
export function getEmptyStructure(role: string): MedicalSections {
  switch (role) {
    case 'soap':
      return {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      };
    case 'consultation':
      return {
        reasonForConsultation: '',
        history: '',
        findings: '',
        impression: '',
        recommendations: ''
      };
    case 'prescription':
      return {
        patientInformation: {
          name: '',
          sex: '',
          age: '',
          date: '',
        },
        medications: [],
        prescriberInformation: {
          name: '',
          licenseNumber: '',
          s2Number: '',
          ptrNumber: ''
        }
      };
    default:
      return {
        chiefComplaint: '',
        historyOfPresentIllness: '',
        pastMedicalHistory: '',
        medications: '',
        allergies: '',
        physicalExamination: '',
        assessment: '',
        plan: ''
      };
  }
}
