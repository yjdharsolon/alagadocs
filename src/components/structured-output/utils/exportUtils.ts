
// This file is a centralized export point for all export utilities
// This helps maintain backward compatibility while organizing code better

export { exportAsPDF, exportPrescriptionAsPDF } from './pdfExport';
export { exportAsText, formatClipboardText } from './textExport';

// Prescription-specific export utilities
export const formatPrescriptionForExport = (sections: any) => {
  // Ensure we have a proper data structure, even if some fields are missing
  const formattedData = {
    patientInformation: sections.patientInformation 
      ? (typeof sections.patientInformation === 'string' 
          ? sections.patientInformation 
          : `Patient: ${sections.patientInformation.name || 'Unknown'}\nSex: ${sections.patientInformation.sex || 'N/A'}\nAge: ${sections.patientInformation.age || 'N/A'}\nDate: ${sections.patientInformation.date || 'N/A'}`)
      : 'No patient information',
    medications: Array.isArray(sections.medications) 
      ? sections.medications.map((med: any) => 
          typeof med === 'string' ? med : JSON.stringify(med)).join('\n') 
      : (sections.medications || 'No medications specified'),
    prescriberInformation: sections.prescriberInformation 
      ? (typeof sections.prescriberInformation === 'string'
          ? sections.prescriberInformation
          : `Prescriber: ${sections.prescriberInformation.name || 'Unknown'}\nLicense: ${sections.prescriberInformation.licenseNumber || 'N/A'}`)
      : 'No prescriber information',
    instructions: sections.instructions || 'No special instructions'
    // Removed the spread operator to prevent non-string values from being included directly
  };
  
  return formattedData;
};
