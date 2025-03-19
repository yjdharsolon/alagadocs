
import { jsPDF } from 'jspdf';

/**
 * Adds doctor/clinic header section to a prescription PDF
 */
export const addHeaderSection = (
  doc: jsPDF,
  profileData: any,
  margin: number,
  contentWidth: number
): number => {
  // Extract doctor information
  const doctorName = profileData?.medical_title 
    ? `${profileData.first_name || ''} ${profileData.last_name || ''}, ${profileData.medical_title}` 
    : `${profileData?.first_name || ''} ${profileData?.last_name || ''}`;
  
  const specialty = profileData?.profession || '';
  const contactNumber = profileData?.contact_number || '';
  const clinicSchedule = profileData?.clinic_schedule || '';
  const clinicName = profileData?.clinic_name || '';
  const clinicAddress = profileData?.clinic_address || '';
  
  let yPosition = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Column 1 (Doctor info)
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
  
  return yPosition + 8;
};
