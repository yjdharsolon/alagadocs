
import { MedicalSections } from '../../types';
import { jsPDF } from 'jspdf';
import { ensureString, getPageLayout, createPdfFilename, createPdfDocument } from './pdfUtils';

/**
 * Exports structured data as PDF
 * @param sections The structured data to export
 * @param patientName Optional patient name for the PDF title
 */
export const exportAsPDF = (sections: MedicalSections, patientName?: string | null): void => {
  const doc = createPdfDocument();
  const { pageWidth, margin, contentWidth } = getPageLayout(doc);
  
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
  const fileName = createPdfFilename('medical_notes', patientName);
  doc.save(fileName);
};
