
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
  if (structuredData.subjective && structuredData.objective) {
    return 'soap';
  } else if (structuredData.reasonForConsultation && structuredData.impression) {
    return 'consultation';
  } else if (structuredData.patientInformation && structuredData.prescriberInformation) {
    return 'prescription';
  } else {
    return 'standard';
  }
};
