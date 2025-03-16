
import { MedicalSections } from '../types';

/**
 * Formats structured data for clipboard copying
 * @param sections The structured data sections to format
 * @returns Formatted text ready for clipboard
 */
export const formatClipboardText = (sections: MedicalSections): string => {
  let formattedText = '';
  
  Object.entries(sections).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      const sectionTitle = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      formattedText += `${sectionTitle}:\n${value}\n\n`;
    }
  });
  
  return formattedText.trim();
};
