
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Parses structured text into sections using regex patterns
 * @param text The structured text to parse
 * @returns Object containing parsed sections
 */
export const parseStructuredText = (text: string): MedicalSections => {
  // Basic parsing of headers and content
  const parsedSections: MedicalSections = {
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: '',
    plan: ''
  };
  
  // Enhanced regex-based parsing for each section with improved pattern matching
  // Chief Complaint
  const ccMatch = text.match(/chief\s*complaint:?([^#]+?)(?=\b(?:history|past|medications|allergies|physical|assessment|plan)\b|$)/i);
  if (ccMatch) parsedSections.chiefComplaint = ccMatch[1].trim();
  
  // History of Present Illness
  const hpiMatch = text.match(/history\s*of\s*present\s*illness:?([^#]+?)(?=\b(?:past|medications|allergies|physical|assessment|plan)\b|$)/i);
  if (hpiMatch) parsedSections.historyOfPresentIllness = hpiMatch[1].trim();
  
  // Past Medical History
  const pmhMatch = text.match(/past\s*medical\s*history:?([^#]+?)(?=\b(?:medications|allergies|physical|assessment|plan)\b|$)/i);
  if (pmhMatch) parsedSections.pastMedicalHistory = pmhMatch[1].trim();
  
  // Medications
  const medMatch = text.match(/medications:?([^#]+?)(?=\b(?:allergies|physical|assessment|plan)\b|$)/i);
  if (medMatch) parsedSections.medications = medMatch[1].trim();
  
  // Allergies
  const allergyMatch = text.match(/allergies:?([^#]+?)(?=\b(?:physical|assessment|plan)\b|$)/i);
  if (allergyMatch) parsedSections.allergies = allergyMatch[1].trim();
  
  // Physical Examination
  const peMatch = text.match(/physical\s*examination:?([^#]+?)(?=\b(?:assessment|plan)\b|$)/i);
  if (peMatch) parsedSections.physicalExamination = peMatch[1].trim();
  
  // Assessment
  const assessMatch = text.match(/assessment:?([^#]+?)(?=\b(?:plan)\b|$)/i);
  if (assessMatch) parsedSections.assessment = assessMatch[1].trim();
  
  // Plan
  const planMatch = text.match(/plan:?([^#]+)$/i);
  if (planMatch) parsedSections.plan = planMatch[1].trim();
  
  return parsedSections;
};
