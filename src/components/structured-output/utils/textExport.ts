
import { MedicalSections } from '../types';

/**
 * Ensures a value is a string for safe use in export functions
 */
const ensureString = (value: any): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => ensureString(item)).join('\n');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
};

/**
 * Formats structured data for clipboard copying
 * @param sections The structured data sections to format
 * @returns Formatted text ready for clipboard or export
 */
const formatTextForExport = (sections: MedicalSections): string => {
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

/**
 * Exports structured data as a text file
 * @param sections The structured data to export
 * @param patientName Optional patient name for the filename
 */
export const exportAsText = (sections: MedicalSections, patientName?: string | null): void => {
  const formattedText = formatTextForExport(sections);
  
  // Create a blob with the formatted text
  const blob = new Blob([formattedText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  
  // Generate filename
  const fileName = patientName 
    ? `medical_notes_${patientName.toLowerCase().replace(/\s+/g, '_')}.txt`
    : 'medical_notes.txt';
  
  link.download = fileName;
  
  // Append to the document, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export the formatter for other modules to use
export { formatTextForExport as formatClipboardText };
