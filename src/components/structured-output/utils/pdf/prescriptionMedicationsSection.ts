
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
  
  // Add Rx symbol
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("Rx", pageWidth / 2, yPosition, { align: 'center' });
  
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
    doc.text("No medications prescribed.", margin, yPosition);
    return yPosition + 8;
  }
  
  if (typeof medications === 'string') {
    // If medications is a string, display as is
    const medLines = doc.splitTextToSize(medications, contentWidth);
    doc.text(medLines, margin, yPosition);
    return yPosition + medLines.length * 5;
  }
  
  if (Array.isArray(medications)) {
    // Process each medication in the array
    medications.forEach((med, index) => {
      try {
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
          // If medication is an object with structured data
          // Handle both new format (genericName + brandName) and old format (name)
          const genericName = med.genericName || med.name || '';
          const brandName = med.brandName ? ` (${med.brandName})` : '';
          const medStrength = med.strength || '';
          const medDosageForm = med.dosageForm || '';
          const medQuantity = med.quantity || '';
          const medRefills = med.refills || '';
          const medSigInstructions = med.sigInstructions || '';
          const medSpecialInstructions = med.specialInstructions || '';
          
          // Medication name, strength, and form
          const medText = `${index + 1}. ${genericName}${brandName} ${medStrength} ${medDosageForm}`;
          const qtyText = `Qty: ${medQuantity}`;
          
          doc.text(medText, margin, yPosition);
          
          // Right-align quantity
          const qtyX = pageWidth - margin - doc.getTextWidth(qtyText);
          doc.text(qtyText, qtyX, yPosition);
          
          yPosition += 5;
          
          // Add refills information
          if (medRefills) {
            const refillsText = `Refills: ${medRefills}`;
            doc.text(refillsText, margin + 10, yPosition);
            yPosition += 5;
          }
          
          // Instructions
          if (medSigInstructions) {
            const sigLabel = "Sig: ";
            doc.text(sigLabel, margin + 10, yPosition);
            
            const sigLines = doc.splitTextToSize(medSigInstructions, contentWidth - 25);
            doc.text(sigLines, margin + 25, yPosition);
            yPosition += sigLines.length * 5;
          }
          
          // Special instructions if any
          if (medSpecialInstructions) {
            const specialLabel = "Special Instructions: ";
            doc.text(specialLabel, margin + 10, yPosition);
            
            const specialLines = doc.splitTextToSize(medSpecialInstructions, contentWidth - 45);
            doc.text(specialLines, margin + 45, yPosition);
            yPosition += specialLines.length * 5;
          }
        }
      } catch (error) {
        console.error('Error processing medication for PDF:', error);
        
        // Fallback for any parsing errors
        const medStr = ensureString(med);
        const medLines = doc.splitTextToSize(`${index + 1}. ${medStr}`, contentWidth);
        doc.text(medLines, margin, yPosition);
        yPosition += medLines.length * 5;
      }
      
      // Add spacing between medications
      yPosition += 8;
    });
  }
  
  return yPosition;
};
