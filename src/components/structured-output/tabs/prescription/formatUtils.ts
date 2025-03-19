
import { MedicalSections } from '../../types';

/**
 * Format medications to show numbering
 */
export const formatMedications = (medications: any[]) => {
  if (!medications || !Array.isArray(medications)) return "No medications specified";
  
  return medications.map((med, index) => {
    const medNumber = med.id || (index + 1);
    return `${medNumber}. ${med.name} ${med.strength || ''} (${med.dosageForm || 'Not specified'})
    Sig: ${med.sigInstructions || 'Not specified'}
    Quantity: ${med.quantity || 'Not specified'}
    Refills: ${med.refills || 'Not specified'}
    ${med.specialInstructions ? `Special Instructions: ${med.specialInstructions}` : ''}
    `;
  }).join("\n\n");
};

/**
 * Format prescriber information with professional details - title field removed
 */
export const formatPrescriberInfo = (prescriberInfo: any, structuredPrescriberInfo: any) => {
  if (!prescriberInfo) return String(structuredPrescriberInfo || "No prescriber information");

  let formattedInfo = '';
  
  // Create properly formatted name without title
  if (prescriberInfo.first_name || prescriberInfo.last_name) {
    const firstName = prescriberInfo.first_name || '';
    const middleName = prescriberInfo.middle_name ? prescriberInfo.middle_name.charAt(0) + '. ' : '';
    const lastName = prescriberInfo.last_name || '';
    const nameExtension = prescriberInfo.name_extension ? `, ${prescriberInfo.name_extension}` : '';
    
    formattedInfo += `${firstName} ${middleName}${lastName}${nameExtension}\n`;
  } else if (structuredPrescriberInfo && structuredPrescriberInfo.name) {
    // Fall back to structured data if profile data not available
    formattedInfo += `${structuredPrescriberInfo.name}\n`;
  }
  
  if (prescriberInfo.profession) {
    formattedInfo += `${prescriberInfo.profession}\n`;
  }
  
  // Add professional license information in specific order: PRC, S2, PTR
  if (prescriberInfo.prc_license || (structuredPrescriberInfo && structuredPrescriberInfo.licenseNumber)) {
    formattedInfo += `PRC License No: ${prescriberInfo.prc_license || (structuredPrescriberInfo ? structuredPrescriberInfo.licenseNumber : '')}\n`;
  }
  
  if (prescriberInfo.s2_number || (structuredPrescriberInfo && structuredPrescriberInfo.s2Number)) {
    formattedInfo += `S2 No: ${prescriberInfo.s2_number || (structuredPrescriberInfo ? structuredPrescriberInfo.s2Number : '')}\n`;
  }
  
  if (prescriberInfo.ptr_number || (structuredPrescriberInfo && structuredPrescriberInfo.ptrNumber)) {
    formattedInfo += `PTR No: ${prescriberInfo.ptr_number || (structuredPrescriberInfo ? structuredPrescriberInfo.ptrNumber : '')}\n`;
  }
  
  // Add clinic information
  if (prescriberInfo.clinic_name) {
    formattedInfo += `\n${prescriberInfo.clinic_name}\n`;
  }
  
  if (prescriberInfo.clinic_address) {
    formattedInfo += `${prescriberInfo.clinic_address}\n`;
  }
  
  if (prescriberInfo.clinic_schedule) {
    formattedInfo += `Hours: ${prescriberInfo.clinic_schedule}\n`;
  }
  
  if (prescriberInfo.contact_number) {
    formattedInfo += `Contact: ${prescriberInfo.contact_number}\n`;
  }
  
  // If no profile info is available, use structured prescriber info as fallback
  return formattedInfo || String(structuredPrescriberInfo || "No prescriber information");
};
