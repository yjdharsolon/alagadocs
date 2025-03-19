
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
  
  // ===== HEADER SECTION (Doctor & Clinic Info) =====
  let yPosition = addHeaderSection(doc, profileData, margin, contentWidth);
  
  // ===== PATIENT INFORMATION =====
  doc.setFontSize(11);
  yPosition = addPatientInfoSection(doc, sections.patientInformation, margin, patientName, yPosition);
  
  // ===== MEDICATIONS SECTION =====
  yPosition = addMedicationsSection(doc, sections.medications, margin, contentWidth, yPosition);
  
  // ===== PRESCRIBER'S DETAILS (FOOTER) =====
  addPrescriberSection(doc, sections.prescriberInformation, profileData, margin, contentWidth, pageHeight);
  
  // Save the PDF
  const fileName = createPdfFilename('prescription', patientName);
  doc.save(fileName);
};
