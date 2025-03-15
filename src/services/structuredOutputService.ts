
// This file serves as a compatibility layer for the refactored services
// It reexports everything from the new modules to maintain the existing API

import { 
  structureTranscription,
  getStructuredNoteById,
  getUserStructuredNotes,
  saveStructuredNote,
  deleteStructuredNote
} from './structuredOutput';

// Re-export everything to maintain the existing interface
export {
  structureTranscription,
  getStructuredNoteById,
  getUserStructuredNotes,
  saveStructuredNote,
  deleteStructuredNote
};
