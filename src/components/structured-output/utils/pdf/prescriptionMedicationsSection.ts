
import { jsPDF } from 'jspdf';
import { ensureString } from './pdfUtils';

/**
 * Adds medications section to a prescription PDF
 */
export const addMedicationsSection = (
  doc: jsPDF, 
  medications: any, 
  margin: number, 
  contentWidth: number,
  startY: number
): number => {
  let yPosition = startY;
  
  console.log('DEBUG: Medications data type:', typeof medications);
  console.log('DEBUG: Medications is array?', Array.isArray(medications));
  console.log('DEBUG: Medications value:', 
    typeof medications === 'object' 
      ? JSON.stringify(medications).substring(0, 200) + '...' 
      : medications
  );
  
  // Add Rx symbol
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("Rx", margin, yPosition);
  
  yPosition += 12;
  
  // Add medications header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("Medications:", margin, yPosition);
  
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Handle different formats of medication data
  if (!medications) {
    // No medications
    console.log('DEBUG: No medications found');
    doc.text("No medications prescribed.", margin, yPosition);
    return yPosition + 8;
  }
  
  if (typeof medications === 'string') {
    // If medications is a string, display as is
    console.log('DEBUG: Processing medications as string');
    const medLines = doc.splitTextToSize(medications, contentWidth);
    doc.text(medLines, margin, yPosition);
    return yPosition + medLines.length * 5;
  }
  
  if (Array.isArray(medications)) {
    // Process each medication in the array
    console.log('DEBUG: Processing medications as array with', medications.length, 'items');
    medications.forEach((med, index) => {
      try {
        console.log(`DEBUG: Processing medication ${index}:`, 
          typeof med === 'object' 
            ? JSON.stringify(med).substring(0, 100) + '...' 
            : med
        );
        
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
        } else if (med && typeof med === 'object') {
          // If medication is a structured object
          const genericName = med.genericName || med.name || '';
          const brandName = med.brandName ? ` (${med.brandName})` : '';
          const strength = med.strength || '';
          const dosageForm = med.dosageForm || '';
          const quantity = med.quantity || '';
          const refills = med.refills || '';
          const sigInstructions = med.sigInstructions || '';
          const specialInstructions = med.specialInstructions || '';
          
          console.log('DEBUG: Medication fields:', {
            genericName, brandName, strength, dosageForm, 
            quantity, refills, sigInstructions, specialInstructions
          });
          
          // Format the medication line
          const medicationText = `${index + 1}. ${genericName}${brandName} ${strength} ${dosageForm}`;
          doc.text(medicationText, margin, yPosition);
          
          // Add quantity on the same line but right-aligned
          if (quantity) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const quantityText = `Qty: ${quantity}`;
            const quantityWidth = doc.getTextWidth(quantityText);
            doc.text(quantityText, pageWidth - margin - quantityWidth, yPosition);
          }
          
          yPosition += 5;
          
          // Add refills if available
          if (refills) {
            doc.text(`Refills: ${refills}`, margin + 10, yPosition);
            yPosition += 5;
          }
          
          // Add sig instructions if available
          if (sigInstructions) {
            doc.text(`Sig: ${sigInstructions}`, margin + 10, yPosition);
            yPosition += 5;
          }
          
          // Add special instructions if available
          if (specialInstructions) {
            doc.text(`Note: ${specialInstructions}`, margin + 10, yPosition);
            yPosition += 5;
          }
        }
      } catch (error) {
        console.error('Error processing medication:', error);
        const medText = typeof med === 'object' ? JSON.stringify(med) : String(med);
        doc.text(`${index + 1}. ${medText}`, margin, yPosition);
        yPosition += 5;
      }
      
      // Add spacing between medications
      yPosition += 8;
    });
  }
  
  return yPosition;
};
