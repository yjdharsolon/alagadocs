
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
 * Format prescriber information with professional details
 */
export const formatPrescriberInfo = (prescriberInfo: any, structuredPrescriberInfo: any) => {
  if (!prescriberInfo) return String(structuredPrescriberInfo || "No prescriber information");

  let formattedInfo = '';
  const name = `${prescriberInfo.first_name || ''} ${prescriberInfo.middle_name ? prescriberInfo.middle_name.charAt(0) + '. ' : ''}${prescriberInfo.last_name || ''}${prescriberInfo.name_extension ? ', ' + prescriberInfo.name_extension : ''}`;
  
  // Add doctor's name and title
  formattedInfo += `${name}${prescriberInfo.medical_title ? ', ' + prescriberInfo.medical_title : ''}\n`;
  formattedInfo += `${prescriberInfo.profession || ''}\n`;
  
  // Add professional license information
  if (prescriberInfo.prc_license) {
    formattedInfo += `PRC License No: ${prescriberInfo.prc_license}\n`;
  }
  
  if (prescriberInfo.ptr_number) {
    formattedInfo += `PTR No: ${prescriberInfo.ptr_number}\n`;
  }
  
  if (prescriberInfo.s2_number) {
    formattedInfo += `S2 No: ${prescriberInfo.s2_number}\n`;
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
