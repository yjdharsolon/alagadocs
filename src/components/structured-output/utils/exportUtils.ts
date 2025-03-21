
// This file is a centralized export point for all export utilities
// This helps maintain backward compatibility while organizing code better

// Import from direct source to avoid circular references
export { exportAsPDF, exportPrescriptionAsPDF } from './pdf/index';
export { exportAsText, formatClipboardText } from './text';

// Prescription-specific export utilities
export const formatPrescriptionForExport = (sections: any) => {
  // Ensure the sections are properly structured
  // This is a safety check before sending to the PDF generator
  const formattedSections = {
    ...sections,
    // Ensure patientInformation is an object
    patientInformation: typeof sections.patientInformation === 'object' 
      ? sections.patientInformation 
      : { name: sections.patientInformation || '' },
    
    // Ensure medications is either a string or array
    medications: sections.medications || [],
    
    // Ensure prescriberInformation is an object
    prescriberInformation: typeof sections.prescriberInformation === 'object'
      ? sections.prescriberInformation
      : { name: sections.prescriberInformation || 'Attending Physician' }
  };
  
  return formattedSections;
};
