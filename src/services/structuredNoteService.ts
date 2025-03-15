
// This file serves as a compatibility layer for the refactored services
// It re-exports everything from the new modules to maintain the existing API
import { 
  getStructuredNote,
  getStructuredNoteById,
  getUserStructuredNotes
} from './structuredNote/getNote';

import { saveStructuredNote } from './structuredNote/saveNote';
import { deleteStructuredNote } from './structuredNote/deleteNote';

// Re-export everything to maintain the existing interface
export {
  getStructuredNote,
  getStructuredNoteById,
  getUserStructuredNotes,
  saveStructuredNote,
  deleteStructuredNote
};
