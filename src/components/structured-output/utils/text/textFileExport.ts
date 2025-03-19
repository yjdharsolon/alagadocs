
import { MedicalSections } from '../../types';
import { formatClipboardText } from './textFormatter';

/**
 * Exports structured data as a text file
 * @param sections The structured data to export
 * @param patientName Optional patient name for the filename
 */
export const exportAsText = (sections: MedicalSections, patientName?: string | null): void => {
  const formattedText = formatClipboardText(sections);
  
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
