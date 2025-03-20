
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Creates a fallback structure when the response cannot be parsed or is incomplete.
 * This function is used as a last resort when structured data cannot be properly 
 * extracted or normalized. It creates a basic MedicalSections object with the 
 * raw text in the assessment field.
 * 
 * @param text - The raw text to include in the fallback structure
 * @returns A basic MedicalSections object with the text in the assessment field and empty strings for other fields
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
