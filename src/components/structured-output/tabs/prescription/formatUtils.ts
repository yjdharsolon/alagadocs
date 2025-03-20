
import { MedicalSections } from '../../types';

/**
 * Parse medication text to extract generic name, brand name and strength
 * This function handles formats like "Aspirin (aspilets) 80 mg"
 */
export const parseMedicationName = (medicationText: string): { genericName: string, brandName: string, strength: string } => {
  if (!medicationText) return { genericName: 'Not specified', brandName: '', strength: '' };
  
  try {
    // Regular expression to match pattern: GenericName (BrandName) Strength
    const regex = /^([^(]+)\s*(?:\(([^)]+)\))?\s*(.*)$/;
    const matches = medicationText.match(regex);
    
    if (matches) {
      const genericName = matches[1]?.trim() || 'Not specified';
      const brandName = matches[2]?.trim() || '';
      const strength = matches[3]?.trim() || '';
      
      console.log(`Parsed medication: "${medicationText}" -> Generic: "${genericName}", Brand: "${brandName}", Strength: "${strength}"`);
      return { genericName, brandName, strength };
    }
    
    // If no match with pattern, return the whole string as generic name
    return { genericName: medicationText.trim(), brandName: '', strength: '' };
  } catch (error) {
    console.error('Error parsing medication name:', error);
    return { genericName: medicationText, brandName: '', strength: '' };
  }
};

/**
 * Format medications to show numbering
 */
export const formatMedications = (medications: any[]) => {
  if (!medications || !Array.isArray(medications)) return "No medications specified";
  
  console.log('Formatting medications:', JSON.stringify(medications, null, 2));
  
  return medications.map((med, index) => {
    try {
      const medNumber = med.id || (index + 1);
      
      // Handle case where medication might be a simple string from transcription
      if (typeof med === 'string') {
        const { genericName, brandName, strength } = parseMedicationName(med);
        console.log(`Medication string "${med}" parsed as generic: "${genericName}", brand: "${brandName}", strength: "${strength}"`);
        
        return `${medNumber}. ${genericName}${brandName ? ` (${brandName})` : ''}${strength ? ` ${strength}` : ''} 
    Sig: Not specified
    Quantity: Not specified
    Refills: Not specified`;
      }
      
      // Format medication with generic and brand name (if available)
      let genericName = med.genericName || med.name || 'Not specified'; // For backward compatibility
      let brandName = med.brandName || '';
      let strength = med.strength || '';
      
      // If genericName contains a pattern like "Generic (Brand)", parse it
      if (genericName.includes('(') && genericName.includes(')') && !brandName) {
        const parsedNames = parseMedicationName(genericName);
        genericName = parsedNames.genericName;
        brandName = parsedNames.brandName;
        // Only use parsed strength if original strength is empty
        if (!strength && parsedNames.strength) {
          strength = parsedNames.strength;
        }
      }
      
      // Format brand name with parentheses if it exists
      const formattedBrandName = brandName && brandName.trim() !== '' ? ` (${brandName})` : '';
      
      console.log(`Medication ${medNumber} - Generic Name: "${genericName}", Brand Name: "${brandName}", Formatted Brand: "${formattedBrandName}", Strength: "${strength}"`);
      
      return `${medNumber}. ${genericName}${formattedBrandName}${strength ? ` ${strength}` : ''} ${med.dosageForm ? `(${med.dosageForm})` : ''}
    Sig: ${med.sigInstructions || 'Not specified'}
    Quantity: ${med.quantity || 'Not specified'}
    Refills: ${med.refills || 'Not specified'}
    ${med.specialInstructions ? `Special Instructions: ${med.specialInstructions}` : ''}
    `;
    } catch (error) {
      console.error('Error formatting medication:', error, med);
      return `${index + 1}. Error formatting medication`;
    }
  }).join("\n\n");
};

/**
 * Format prescriber information with professional details - title included beside name
 */
export const formatPrescriberInfo = (prescriberInfo: any, structuredPrescriberInfo: any) => {
  if (!prescriberInfo) return String(structuredPrescriberInfo || "No prescriber information");

  let formattedInfo = '';
  
  // Create properly formatted name with medical title beside name
  if (prescriberInfo.first_name || prescriberInfo.last_name) {
    const firstName = prescriberInfo.first_name || '';
    const middleName = prescriberInfo.middle_name ? prescriberInfo.middle_name.charAt(0) + '. ' : '';
    const lastName = prescriberInfo.last_name || '';
    const nameExtension = prescriberInfo.name_extension ? `, ${prescriberInfo.name_extension}` : '';
    const medicalTitle = prescriberInfo.medical_title ? `, ${prescriberInfo.medical_title}` : '';
    
    formattedInfo += `${firstName} ${middleName}${lastName}${nameExtension}${medicalTitle}\n`;
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
