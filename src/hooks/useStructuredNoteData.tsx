
import { useState, useEffect } from 'react';
import { MedicalSections, TextTemplate } from '@/components/structured-output/types';
import { getStructuredNote, getStructuredNoteById } from '@/services/structuredTextService';

interface UseStructuredNoteDataParams {
  transcriptionData?: any;
  transcriptionId?: string;
  noteId?: string;
}

export const useStructuredNoteData = ({ 
  transcriptionData, 
  transcriptionId,
  noteId
}: UseStructuredNoteDataParams) => {
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load note by ID if provided
  useEffect(() => {
    async function loadNoteById() {
      if (!noteId) return;
      
      try {
        setLoading(true);
        const note = await getStructuredNoteById(noteId);
        
        if (note?.content) {
          setStructuredData(note.content);
        } else {
          setError('Note not found');
        }
      } catch (err) {
        console.error('Error loading note by ID:', err);
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    }
    
    if (noteId) {
      loadNoteById();
    }
  }, [noteId]);

  // Check for existing structured note
  const checkExistingNote = async () => {
    if (noteId) return true; // If we're loading by noteId, no need to check
    if (!transcriptionId) return false;
    
    try {
      const existingData = await getStructuredNote(transcriptionId);
      
      if (existingData?.content) {
        console.log('Found existing structured note');
        setStructuredData(existingData.content);
        setLoading(false);
        return true;
      }
    } catch (lookupError) {
      console.log('No existing structured note found, will create a new one:', lookupError);
    }
    
    return false;
  };

  return {
    loading,
    setLoading,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData,
    error,
    setError,
    checkExistingNote
  };
};
