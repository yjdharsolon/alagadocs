
// This file is a centralized export point for all export utilities
// This helps maintain backward compatibility while organizing code better

export { exportAsPDF } from './pdfExport';
export { exportAsText } from './textExport';
export { formatClipboardText } from './clipboardUtils';

// Prescription-specific export utilities
export const formatPrescriptionForExport = (sections: any) => {
  // Ensure we have a proper data structure, even if some fields are missing
  const formattedData = {
    patientInformation: sections.patientInformation || 'No patient information',
    medications: sections.medications || 'No medications specified',
    prescriberInformation: sections.prescriberInformation || 'No prescriber information',
    instructions: sections.instructions || 'No special instructions',
    ...sections // Include any other sections that might be present
  };
  
  return formattedData;
};
