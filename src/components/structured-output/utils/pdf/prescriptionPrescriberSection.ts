
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
  
  // Use profile data if available, otherwise use prescriber info
  const prescriberName = profileData?.medical_title 
    ? `Dr. ${profileData.first_name || ''} ${profileData.last_name || ''}, ${profileData.medical_title}` 
    : (typeof prescriberInfo === 'object' ? prescriberInfo.name || '' : '');
  
  const doctorName = `${profileData?.first_name || ''} ${profileData?.last_name || ''}`;
  
  const prcLicense = profileData?.prc_license || (typeof prescriberInfo === 'object' ? prescriberInfo.licenseNumber || '' : '');
  const ptrNumber = profileData?.ptr_number || '';
  const s2Number = profileData?.s2_number || '';
  
  // Position footer content
  const footerX = pageWidth - margin - (contentWidth * 0.3);
  let currentY = footerY;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(prescriberName || doctorName, footerX, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  
  currentY += 5;
  if (prcLicense) doc.text(`PRC No.: ${prcLicense}`, footerX, currentY);
  
  currentY += 5;
  if (s2Number) doc.text(`S2 No.: ${s2Number}`, footerX, currentY);
  
  currentY += 5;
  if (ptrNumber) doc.text(`PTR No.: ${ptrNumber}`, footerX, currentY);
};
