import { MedicalSections } from '../types';
import { jsPDF } from 'jspdf';
import { useProfileFields } from '@/hooks/useProfileFields';

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
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // ===== HEADER SECTION =====
  // Extract doctor information
  const doctorName = profileData?.medical_title 
    ? `${profileData.first_name || ''} ${profileData.last_name || ''}, ${profileData.medical_title}` 
    : `${profileData?.first_name || ''} ${profileData?.last_name || ''}`;
  
  const specialty = profileData?.profession || '';
  const contactNumber = profileData?.contact_number || '';
  const clinicSchedule = profileData?.clinic_schedule || '';
  const clinicName = profileData?.clinic_name || '';
  const clinicAddress = profileData?.clinic_address || '';
  
  // Column 1 (Doctor info)
  let yPosition = margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  
  // Ensure doctor name isn't empty
  if (doctorName.trim()) {
    doc.text(doctorName, margin, yPosition);
  } else {
    doc.text("Doctor Name", margin, yPosition);
  }
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  yPosition += 6;
  if (specialty) doc.text(specialty, margin, yPosition);
  
  yPosition += 5;
  if (clinicSchedule) doc.text(`Office Hours: ${clinicSchedule}`, margin, yPosition);
  
  yPosition += 5;
  if (contactNumber) doc.text(`Contact: ${contactNumber}`, margin, yPosition);
  
  // Column 2 (Clinic info)
  if (clinicName || clinicAddress) {
    const col2X = pageWidth - margin - (contentWidth * 0.3);
    let col2Y = margin;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    if (clinicName) {
      doc.text(clinicName, col2X, col2Y);
      col2Y += 6;
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    if (clinicAddress) {
      const addressLines = doc.splitTextToSize(clinicAddress, contentWidth * 0.3);
      doc.text(addressLines, col2X, col2Y);
    }
  }
  
  // Separator line
  yPosition = Math.max(yPosition, margin + 20);
  yPosition += 5;
  doc.setDrawColor(0);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  // ===== PATIENT INFORMATION =====
  doc.setFontSize(11);
  
  // Extract patient info from sections or use defaults
  let patientInfo = sections.patientInformation || {};
  const patientInfoStr = typeof patientInfo === 'string' ? patientInfo : '';
  
  if (typeof patientInfo === 'string') {
    patientInfo = {};
  }
  
  const patientFullName = (patientInfo as any).name || patientName || '';
  const patientAge = (patientInfo as any).age || '';
  const patientSex = (patientInfo as any).sex || '';
  const currentDate = (patientInfo as any).date || new Date().toLocaleDateString();
  
  // Format patient info
  doc.text("NAME:", margin, yPosition);
  doc.text(patientFullName, margin + 30, yPosition);
  
  // Underline the name
  const nameWidth = doc.getTextWidth(patientFullName);
  if (nameWidth > 0) {
    doc.line(margin + 30, yPosition + 1, margin + 30 + nameWidth, yPosition + 1);
  } else {
    doc.line(margin + 30, yPosition + 1, margin + 120, yPosition + 1);
  }
  
  yPosition += 8;
  const ageStart = margin;
  const sexStart = margin + 60;
  
  doc.text("AGE:", ageStart, yPosition);
  doc.text(patientAge, ageStart + 25, yPosition);
  
  doc.text("SEX:", sexStart, yPosition);
  doc.text(patientSex, sexStart + 25, yPosition);
  
  // Date on the right side
  const dateText = `DATE: ${currentDate}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
  
  yPosition += 12;
  
  // ===== Rx SYMBOL =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("Rx", pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 12;
  
  // ===== MEDICATIONS SECTION =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("Medications:", margin, yPosition);
  
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Process medications
  let medicationsData = sections.medications || [];
  
  if (typeof medicationsData === 'string') {
    // If medications is a string, display as is
    const medLines = doc.splitTextToSize(medicationsData, contentWidth);
    doc.text(medLines, margin, yPosition);
    yPosition += medLines.length * 5;
  } else if (Array.isArray(medicationsData)) {
    // Process each medication
    medicationsData.forEach((med, index) => {
      if (typeof med === 'string') {
        // If medication is a plain string
        const medLines = doc.splitTextToSize(med, contentWidth);
        doc.text(`${index + 1}. ${medLines[0]}`, margin, yPosition);
        yPosition += 5;
        
        if (medLines.length > 1) {
          for (let i = 1; i < medLines.length; i++) {
            doc.text(medLines[i], margin + 10, yPosition);
            yPosition += 5;
          }
        }
      } else {
        // If medication is an object with structured data
        try {
          const medName = med.name || '';
          const medStrength = med.strength || '';
          const medDosageForm = med.dosageForm || '';
          const medQuantity = med.quantity || '';
          const medSigInstructions = med.sigInstructions || '';
          const medSpecialInstructions = med.specialInstructions || '';
          
          // Medication name, strength, and form
          const medText = `${index + 1}. ${medName} ${medStrength} ${medDosageForm}`;
          const qtyText = `Qty: ${medQuantity}`;
          
          const medTextWidth = doc.getTextWidth(medText);
          doc.text(medText, margin, yPosition);
          
          // Right-align quantity
          const qtyX = pageWidth - margin - doc.getTextWidth(qtyText);
          doc.text(qtyText, qtyX, yPosition);
          
          yPosition += 5;
          
          // Instructions
          if (medSigInstructions) {
            const sigLines = doc.splitTextToSize(medSigInstructions, contentWidth - 10);
            doc.text(sigLines, margin + 10, yPosition);
            yPosition += sigLines.length * 5;
          }
          
          // Special instructions if any
          if (medSpecialInstructions) {
            const specialLines = doc.splitTextToSize(medSpecialInstructions, contentWidth - 10);
            doc.text(specialLines, margin + 10, yPosition);
            yPosition += specialLines.length * 5;
          }
        } catch (error) {
          // Fallback for any parsing errors
          const medStr = ensureString(med);
          const medLines = doc.splitTextToSize(medStr, contentWidth);
          doc.text(`${index + 1}. ${medLines[0]}`, margin, yPosition);
          yPosition += 5;
          
          if (medLines.length > 1) {
            for (let i = 1; i < medLines.length; i++) {
              doc.text(medLines[i], margin + 10, yPosition);
              yPosition += 5;
            }
          }
        }
      }
      
      // Add spacing between medications
      yPosition += 8;
    });
  }
  
  // ===== PRESCRIBER'S DETAILS (FOOTER) =====
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - margin - 30; // Position footer 30 points from bottom
  
  // Extract prescriber information
  let prescriberInfo = sections.prescriberInformation || {};
  const prescriberInfoStr = typeof prescriberInfo === 'string' ? prescriberInfo : '';
  
  if (typeof prescriberInfo === 'string') {
    prescriberInfo = {};
  }
  
  // Use profile data if available, otherwise use prescriber info from sections
  const prescriberName = profileData?.medical_title 
    ? `Dr. ${profileData.first_name || ''} ${profileData.last_name || ''}, ${profileData.medical_title}` 
    : (prescriberInfo as any).name || doctorName || '';
  
  const prcLicense = profileData?.prc_license || (prescriberInfo as any).licenseNumber || '';
  const ptrNumber = profileData?.ptr_number || '';
  const s2Number = profileData?.s2_number || '';
  
  // Position footer content
  const footerX = pageWidth - margin - (contentWidth * 0.3);
  let currentY = footerY;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(prescriberName, footerX, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  currentY += 5;
  if (prcLicense) doc.text(`PRC No.: ${prcLicense}`, footerX, currentY);
  
  currentY += 5;
  if (s2Number) doc.text(`S2 No.: ${s2Number}`, footerX, currentY);
  
  currentY += 5;
  if (ptrNumber) doc.text(`PTR No.: ${ptrNumber}`, footerX, currentY);
  
  // Save the PDF
  const fileName = patientName 
    ? `prescription_${patientName.toLowerCase().replace(/\s+/g, '_')}.pdf`
    : 'prescription.pdf';
    
  doc.save(fileName);
};
