
import { MedicalSections } from '../types';

/**
 * Determines the document format based on the available sections
 */
export const getDocumentFormat = (data: MedicalSections): 'standard' | 'soap' | 'consultation' | 'prescription' => {
  // Add debug to see what fields are available
  console.log('Format detection running for data with keys:', Object.keys(data));
  
  if (data.patientInformation || Array.isArray(data.medications)) {
    console.log('Format detected: Prescription');
    return 'prescription';
  }
  
  if (data.subjective && data.objective) {
    console.log('Format detected: SOAP');
    return 'soap';
  }
  
  if (data.reasonForConsultation) {
    console.log('Format detected: Consultation');
    return 'consultation';
  }
  
  console.log('Format detected: Standard');
  return 'standard';
};

/**
 * Gets the list of sections to display based on document format
 */
export const getDocumentSections = (format: 'standard' | 'soap' | 'consultation' | 'prescription') => {
  console.log('Getting document sections for format:', format);
  
  switch (format) {
    case 'soap':
      return [
        { key: 'subjective', title: 'SUBJECTIVE' },
        { key: 'objective', title: 'OBJECTIVE' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
    case 'consultation':
      return [
        { key: 'reasonForConsultation', title: 'REASON FOR CONSULTATION' },
        { key: 'history', title: 'HISTORY' },
        { key: 'findings', title: 'FINDINGS' },
        { key: 'impression', title: 'IMPRESSION' },
        { key: 'recommendations', title: 'RECOMMENDATIONS' }
      ];
    case 'prescription':
      return [
        { key: 'patientInformation', title: 'PATIENT INFORMATION' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'prescriberInformation', title: 'PRESCRIBER INFORMATION' }
      ];
    default:
      // Standard format
      return [
        { key: 'chiefComplaint', title: 'CHIEF COMPLAINT' },
        { key: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS' },
        { key: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'allergies', title: 'ALLERGIES' },
        { key: 'physicalExamination', title: 'PHYSICAL EXAMINATION' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
  }
};

/**
 * Filters structured data to only include fields relevant to the selected format
 */
export const filterStructuredDataByFormat = (data: MedicalSections, format: 'standard' | 'soap' | 'consultation' | 'prescription'): MedicalSections => {
  const sections = getDocumentSections(format);
  const allowedKeys = sections.map(section => section.key);
  
  console.log(`Filtering data for format ${format}, allowed keys:`, allowedKeys);
  
  // Create a new object with only the allowed keys
  const filteredData: Partial<MedicalSections> = {};
  
  // Only include keys that are valid for this format
  for (const key of allowedKeys) {
    const typedKey = key as keyof MedicalSections;
    if (data[typedKey] !== undefined) {
      // Use type assertion to fix the type error
      filteredData[typedKey] = data[typedKey] as any;
    }
  }
  
  console.log(`Filtered data for format ${format}:`, Object.keys(filteredData));
  
  return filteredData as MedicalSections;
};

/**
 * Formats content for display, handling both string and object types
 */
export const formatContent = (content: any): string => {
  if (!content) return 'Not specified';
  
  if (typeof content === 'string') return content;
  
  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (typeof item === 'string') return `${index + 1}. ${item}`;
      
      // Format medication objects
      if (item.name) {
        const medNumber = item.id || (index + 1);
        return `${medNumber}. ${item.name} ${item.strength || ''} (${item.dosageForm || 'Not specified'})
        Sig: ${item.sigInstructions || 'Not specified'}
        Quantity: ${item.quantity || 'Not specified'}
        Refills: ${item.refills || 'Not specified'}
        ${item.specialInstructions ? `Special Instructions: ${item.specialInstructions}` : ''}`;
      }
      
      return JSON.stringify(item);
    }).join('\n\n');
  }
  
  if (typeof content === 'object') {
    // Handle patient information
    if (content.name) {
      return `Name: ${content.name}
Sex/Gender: ${content.sex || 'Not specified'}
Age: ${content.age || 'Not specified'}
Date: ${content.date || new Date().toISOString().split('T')[0]}`;
    }
    
    // Handle prescriber information
    if (content.licenseNumber) {
      return `Name: ${content.name || 'Not specified'}
License/Registration Number: ${content.licenseNumber || 'Not specified'}
Signature: ${content.signature || '[SIGNATURE]'}`;
    }
    
    // Generic object formatting
    return Object.entries(content)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `${formattedKey}: ${value}`;
      })
      .join('\n');
  }
  
  return String(content);
};
