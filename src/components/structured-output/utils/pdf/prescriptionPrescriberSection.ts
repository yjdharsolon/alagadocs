
import { jsPDF } from 'jspdf';

/**
 * Adds prescriber information section to a prescription PDF
 */
export const addPrescriberSection = (
  doc: jsPDF,
  prescriberInfo: any,
  profileData: any,
  margin: number,
  contentWidth: number,
  pageHeight: number
): void => {
  const footerY = pageHeight - margin - 30; // Position footer 30 points from bottom
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Get prescriber name with proper formatting
  let prescriberName = '';
  
  if (profileData) {
    // Use profile data if available
    const firstName = profileData.first_name || '';
    const middleName = profileData.middle_name ? profileData.middle_name.charAt(0) + '. ' : '';
    const lastName = profileData.last_name || '';
    const nameExtension = profileData.name_extension ? `, ${profileData.name_extension}` : '';
    const title = profileData.medical_title ? `, ${profileData.medical_title}` : '';
    
    prescriberName = `${firstName} ${middleName}${lastName}${nameExtension}${title}`.trim();
  } else if (typeof prescriberInfo === 'object') {
    // Use prescriber info from the prescription
    const name = prescriberInfo.name || '';
    const title = prescriberInfo.title ? `, ${prescriberInfo.title}` : '';
    prescriberName = `${name}${title}`.trim();
  }
  
  // Get license information from profile data if available, otherwise fall back to prescriber info
  const prcLicense = profileData?.prc_license || (typeof prescriberInfo === 'object' ? prescriberInfo.licenseNumber || '' : '');
  const s2Number = profileData?.s2_number || (typeof prescriberInfo === 'object' ? prescriberInfo.s2Number || '' : '');
  const ptrNumber = profileData?.ptr_number || (typeof prescriberInfo === 'object' ? prescriberInfo.ptrNumber || '' : '');
  
  // Position footer content
  const footerX = pageWidth - margin - (contentWidth * 0.3);
  let currentY = footerY;
  
  // Add doctor's name with title on same line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(prescriberName, footerX, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  // Add license information in specific order: PRC, S2, PTR
  currentY += 5;
  if (prcLicense) doc.text(`PRC No.: ${prcLicense}`, footerX, currentY);
  
  currentY += 5;
  if (s2Number) doc.text(`S2 No.: ${s2Number}`, footerX, currentY);
  
  currentY += 5;
  if (ptrNumber) doc.text(`PTR No.: ${ptrNumber}`, footerX, currentY);
};
