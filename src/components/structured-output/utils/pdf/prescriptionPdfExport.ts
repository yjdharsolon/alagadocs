
import { MedicalSections } from '../../types';
import { jsPDF } from 'jspdf';
import { createPdfDocument, createPdfFilename, getPageLayout } from './pdfUtils';
import { addHeaderSection } from './prescriptionHeaderSection';
import { addPatientInfoSection } from './prescriptionPatientSection';
import { addMedicationsSection } from './prescriptionMedicationsSection';
import { addPrescriberSection } from './prescriptionPrescriberSection';

/**
 * Specialized export function for prescription format
 * @param sections The prescription data to export
 * @param patientName Patient name for the PDF filename
 * @param profileData Doctor profile data
 */
export const exportPrescriptionAsPDF = (
  sections: MedicalSections, 
  patientName?: string | null,
  profileData?: any
): void => {
  // Create PDF document
  const doc = createPdfDocument();
  const { pageWidth, margin, contentWidth } = getPageLayout(doc);
  const pageHeight = doc.internal.pageSize.getHeight();
  
  try {
    // Debug logging
    console.log('DEBUG: PDF EXPORT - Starting prescription PDF export', {
      sectionsAvailable: Object.keys(sections),
      patientInfo: typeof sections.patientInformation === 'object' 
        ? JSON.stringify(sections.patientInformation) 
        : typeof sections.patientInformation,
      medications: Array.isArray(sections.medications) 
        ? `Array with ${sections.medications.length} items` 
        : typeof sections.medications,
      prescriberInfo: typeof sections.prescriberInformation === 'object'
        ? JSON.stringify(sections.prescriberInformation)
        : typeof sections.prescriberInformation,
      profileDataAvailable: !!profileData,
    });
    
    // ===== HEADER SECTION (Doctor & Clinic Info) =====
    let yPosition = addHeaderSection(doc, profileData, margin, contentWidth);
    console.log('DEBUG: Added header section, yPosition =', yPosition);
    
    // ===== PATIENT INFORMATION =====
    yPosition = addPatientInfoSection(doc, sections.patientInformation, margin, patientName, yPosition);
    console.log('DEBUG: Added patient info section, yPosition =', yPosition);
    
    // ===== MEDICATIONS SECTION =====
    yPosition = addMedicationsSection(doc, sections.medications, margin, contentWidth, yPosition);
    console.log('DEBUG: Added medications section, yPosition =', yPosition);
    
    // ===== PRESCRIBER'S DETAILS (FOOTER) =====
    addPrescriberSection(doc, sections.prescriberInformation, profileData, margin, contentWidth, pageHeight);
    console.log('DEBUG: Added prescriber section');
    
    // Save the PDF
    const fileName = createPdfFilename('prescription', patientName);
    console.log('DEBUG: Saving PDF with filename:', fileName);
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    // Create a simple fallback PDF with error information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Error generating prescription PDF', margin, margin);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Please try again or contact support. Error: ${error}`, margin, margin + 10);
    doc.save('prescription_error.pdf');
  }
};
