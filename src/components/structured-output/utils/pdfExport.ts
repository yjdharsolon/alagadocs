
import { MedicalSections } from '../types';
import { jsPDF } from 'jspdf';

/**
 * Ensures a value is a string for safe use in export functions
 */
const ensureString = (value: any): string => {
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
 * Exports structured data as PDF
 * @param sections The structured data to export
 * @param patientName Optional patient name for the PDF title
 */
export const exportAsPDF = (sections: MedicalSections, patientName?: string | null): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set up document
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  
  // Add title
  const title = patientName ? `Medical Notes: ${patientName}` : 'Medical Notes';
  doc.text(title, pageWidth / 2, margin, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  let yPosition = margin + 10;
  
  // Add each section
  Object.entries(sections).forEach(([key, value]) => {
    // Ensure value is a string and check if it's empty
    const stringValue = ensureString(value);
    if (!stringValue) return;
    
    // Format section title
    const sectionTitle = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    // Add section header
    doc.setFont('helvetica', 'bold');
    yPosition += 10;
    doc.text(`${sectionTitle}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    
    // Add section content with word wrapping
    const textLines = doc.splitTextToSize(stringValue, contentWidth);
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition + (textLines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(textLines, margin, yPosition);
    yPosition += textLines.length * 5;
  });
  
  // Save the PDF
  const fileName = patientName 
    ? `medical_notes_${patientName.toLowerCase().replace(/\s+/g, '_')}.pdf`
    : 'medical_notes.pdf';
    
  doc.save(fileName);
};
