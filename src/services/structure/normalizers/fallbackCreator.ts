
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Creates a fallback structure when the response cannot be parsed
 * @param text The raw text to include
 * @returns A basic medical sections object with the text in assessment
 */
export const createFallbackStructure = (text: string): MedicalSections => {
  return {
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: text, // Place all text in assessment
    plan: ''
  };
};
