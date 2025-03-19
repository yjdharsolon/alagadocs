
import { MedicalSections } from '../../types';
import { ensureString } from '../pdf/pdfUtils';

/**
 * Formats structured data for clipboard copying or text export
 * @param sections The structured data sections to format
 * @returns Formatted text ready for clipboard or export
 */
export const formatClipboardText = (sections: MedicalSections): string => {
  let formattedText = '';
  
  Object.entries(sections).forEach(([key, value]) => {
    const stringValue = ensureString(value);
    if (stringValue) {
      const sectionTitle = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      formattedText += `${sectionTitle}:\n${stringValue}\n\n`;
    }
  });
  
  return formattedText.trim();
};
