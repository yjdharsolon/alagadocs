
import { MedicalSections } from '../types';

export const formatClipboardText = (structuredData: MedicalSections) => {
  let formattedText = '';
  Object.entries(structuredData).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      const sectionTitle = key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      formattedText += `${sectionTitle}:\n${value}\n\n`;
    }
  });
  
  return formattedText.trim();
};
