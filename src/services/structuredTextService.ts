
import { MedicalSections } from '@/components/structured-output/types';
import { structureText } from './structure/structureService';
import { 
  saveStructuredNote as saveNote,
  getStructuredNoteById,
  getUserStructuredNotes,
  deleteStructuredNote
} from './structuredOutput/noteService';

// Re-export functions to maintain existing interface
export { 
  structureText,
  getStructuredNoteById,
  getUserStructuredNotes,
  deleteStructuredNote
};

/**
 * Saves structured note to the database (facade for backward compatibility)
 */
export const saveStructuredNote = async (
  userId: string,
  transcriptionId: string,
  content: MedicalSections
): Promise<any> => {
  return saveNote(content, transcriptionId);
};

/**
 * Retrieves a structured note from the database (facade for backward compatibility)
 */
export const getStructuredNote = async (transcriptionId: string): Promise<any> => {
  return { error: 'This method has been deprecated. Please use getStructuredNoteById instead.' };
};
