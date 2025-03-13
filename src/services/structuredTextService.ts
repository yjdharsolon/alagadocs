
import { MedicalSections } from '@/components/structured-output/types';
import { structureText } from './structureService';
import { 
  saveStructuredNote as saveNote,
  getStructuredNote as getNote,
  getStructuredNoteById,
  getUserStructuredNotes,
  deleteStructuredNote
} from './structuredNoteService';

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
  return saveNote(userId, transcriptionId, content);
};

/**
 * Retrieves a structured note from the database (facade for backward compatibility)
 */
export const getStructuredNote = async (transcriptionId: string): Promise<any> => {
  return getNote(transcriptionId);
};
