
import { jsPDF } from 'jspdf';

/**
 * Adds patient information section to a prescription PDF
 */
export const addPatientInfoSection = (
  doc: jsPDF, 
  patientInfo: any, 
  margin: number, 
  patientName: string | null | undefined,
  startY: number
): number => {
  let yPosition = startY;
  
  // Format patient info
  doc.text("NAME:", margin, yPosition);
  
  // Extract patient name from patientInfo or use patientName param
  const patientFullName = typeof patientInfo === 'object' ? (patientInfo.name || patientName || '') : patientName || '';
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
  
  // Extract patient age and sex
  const patientAge = typeof patientInfo === 'object' ? (patientInfo.age || '') : '';
  const patientSex = typeof patientInfo === 'object' ? (patientInfo.sex || '') : '';
  
  doc.text("AGE:", ageStart, yPosition);
  doc.text(patientAge, ageStart + 25, yPosition);
  
  doc.text("SEX:", sexStart, yPosition);
  doc.text(patientSex, sexStart + 25, yPosition);
  
  // Date on the right side
  const pageWidth = doc.internal.pageSize.getWidth();
  const currentDate = typeof patientInfo === 'object' ? (patientInfo.date || new Date().toLocaleDateString()) : new Date().toLocaleDateString();
  const dateText = `DATE: ${currentDate}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
  
  return yPosition + 12;
};
