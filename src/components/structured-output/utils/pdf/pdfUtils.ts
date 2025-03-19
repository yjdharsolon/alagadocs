
import { jsPDF } from 'jspdf';

/**
 * Ensures a value is a string for safe use in export functions
 */
export const ensureString = (value: any): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => ensureString(item)).join('\n');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
};

/**
 * Creates and configures a new PDF document with basic settings
 */
export const createPdfDocument = (): jsPDF => {
  return new jsPDF();
};

/**
 * Gets standard page dimensions and margins
 */
export const getPageLayout = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  return { pageWidth, margin, contentWidth };
};

/**
 * Creates a filename based on document type and patient name
 */
export const createPdfFilename = (
  docType: 'medical_notes' | 'prescription',
  patientName?: string | null
): string => {
  const baseFilename = patientName
    ? `${docType}_${patientName.toLowerCase().replace(/\s+/g, '_')}.pdf`
    : `${docType}.pdf`;
    
  return baseFilename;
};
