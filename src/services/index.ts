
// Re-export services
import { uploadAudio } from './audioService';
import { saveStructuredNote } from './noteService';
import {
  fetchTranscription,
  createTranscription,
  updateTranscription,
  fetchTranscriptionById
} from './transcriptionService';
import { structureText } from './structuringService';

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
