
import { MedicalSections } from '../types';

/**
 * Determines the document format based on the available sections
 */
export const getDocumentFormat = (data: MedicalSections): 'standard' | 'soap' | 'consultation' | 'prescription' => {
  if (data.patientInformation || Array.isArray(data.medications)) {
    return 'prescription';
  }
  
  if (data.subjective && data.objective) {
    return 'soap';
  }
  
  if (data.reasonForConsultation) {
    return 'consultation';
  }
  
  return 'standard';
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
