
import { MedicalSections } from '../types';

/**
 * Helper function to format content that might be an array or object
 */
export const formatContent = (content: any): string => {
  if (content === undefined || content === null) {
    return '';
  }
  
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle arrays
  if (Array.isArray(content)) {
    return content.map(item => 
      typeof item === 'string' ? item : JSON.stringify(item, null, 2)
    ).join('\n');
  }
  
  // Handle objects
  return JSON.stringify(content, null, 2);
};

/**
 * Determines document format based on available fields
 */
export const getDocumentFormat = (structuredData: MedicalSections): 'standard' | 'soap' | 'consultation' | 'prescription' => {
  // SOAP format detection
  if (structuredData.subjective && structuredData.objective) {
    return 'soap';
  } 
  
  // Consultation format detection
  else if (structuredData.reasonForConsultation && 
          (structuredData.history || structuredData.findings || structuredData.impression || structuredData.recommendations)) {
    return 'consultation';
  } 
  
  // Prescription format detection
  else if ((structuredData.patientInformation || structuredData.medications) && 
          structuredData.prescriberInformation) {
    return 'prescription';
  } 
  
  // Standard H&P format (default)
  else {
    return 'standard';
  }
};

/**
 * Gets the list of sections to display based on document format
 */
export const getDocumentSections = (format: 'standard' | 'soap' | 'consultation' | 'prescription') => {
  switch (format) {
    case 'soap':
      return [
        { key: 'subjective', title: 'SUBJECTIVE' },
        { key: 'objective', title: 'OBJECTIVE' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
    case 'consultation':
      return [
        { key: 'reasonForConsultation', title: 'REASON FOR CONSULTATION' },
        { key: 'history', title: 'HISTORY' },
        { key: 'findings', title: 'FINDINGS' },
        { key: 'impression', title: 'IMPRESSION' },
        { key: 'recommendations', title: 'RECOMMENDATIONS' }
      ];
    case 'prescription':
      return [
        { key: 'patientInformation', title: 'PATIENT INFORMATION' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'prescriberInformation', title: 'PRESCRIBER INFORMATION' }
      ];
    default:
      // Standard format
      return [
        { key: 'chiefComplaint', title: 'CHIEF COMPLAINT' },
        { key: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS' },
        { key: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'allergies', title: 'ALLERGIES' },
        { key: 'physicalExamination', title: 'PHYSICAL EXAMINATION' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
  }
};

/**
 * Filters structured data to only include fields relevant to the selected format
 */
export const filterStructuredDataByFormat = (data: MedicalSections, format: 'standard' | 'soap' | 'consultation' | 'prescription'): MedicalSections => {
  const sections = getDocumentSections(format);
  const allowedKeys = sections.map(section => section.key);
  
  // Create a new object with only the allowed keys
  const filteredData: Partial<MedicalSections> = {};
  
  // Only include keys that are valid for this format
  for (const key of allowedKeys) {
    const typedKey = key as keyof MedicalSections;
    if (data[typedKey] !== undefined) {
      // Use type assertion to fix the type error
      filteredData[typedKey] = data[typedKey] as any;
    }
  }
  
  return filteredData as MedicalSections;
};
