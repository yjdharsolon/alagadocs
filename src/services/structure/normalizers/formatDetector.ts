
/**
 * Determines the format type from the data structure and role
 * 
 * @param data - The structured data to analyze
 * @param role - The medical professional role or document format type
 * @returns The detected format type (soap, consultation, prescription, or standard)
 */
export function detectFormat(data: any, role: string): string {
  // If role explicitly specifies a format, use that
  if (['soap', 'consultation', 'prescription', 'history'].includes(role)) {
    return role === 'history' ? 'standard' : role;
  }
  
  // Detect format based on data structure
  if (data.subjective !== undefined && data.objective !== undefined) {
    return 'soap';
  } else if (data.reasonForConsultation !== undefined) {
    return 'consultation';
  } else if (data.patientInformation !== undefined || 
           (Array.isArray(data.medications) && typeof data.medications[0] === 'object')) {
    return 'prescription';
  } else if (data.chiefComplaint !== undefined || 
             data.historyOfPresentIllness !== undefined) {
    return 'standard';
  }
  
  // Default to standard format
  return 'standard';
}
