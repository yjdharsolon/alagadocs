
// This file is a centralized export point for all export utilities
// This helps maintain backward compatibility while organizing code better

export { exportAsPDF, exportPrescriptionAsPDF } from './pdf';
export { exportAsText, formatClipboardText } from './textExport';

// Prescription-specific export utilities
export const formatPrescriptionForExport = (sections: any) => {
  // No need for complex transformation here
  // The exportPrescriptionAsPDF function will handle the formatting directly
  return sections;
};
