
// Re-export services
import { uploadAudio } from './audioService';
import { saveStructuredNote } from './noteService';
import { structureText } from './structuringService';

// Temporary empty exports to prevent TypeScript errors
// These should be implemented properly in transcriptionService.ts
const fetchTranscription = () => {};
const createTranscription = () => {};
const updateTranscription = () => {};
const fetchTranscriptionById = () => {};

export {
  // Audio service
  uploadAudio,
  
  // Note service
  saveStructuredNote,
  
  // Transcription service
  fetchTranscription,
  createTranscription,
  updateTranscription,
  fetchTranscriptionById,
  
  // Structuring service
  structureText
};
