
import { useState, useEffect } from 'react';
import { MedicalSections, TextTemplate } from '@/components/structured-output/types';
import { getStructuredNote, getStructuredNoteById } from '@/services/structuredNoteService';

interface UseStructuredNoteDataParams {
  transcriptionData?: any;
  transcriptionId?: string;
  noteId?: string;
  patientId?: string;
}

export const useStructuredNoteData = ({ 
  transcriptionData, 
  transcriptionId,
  noteId,
  patientId
}: UseStructuredNoteDataParams) => {
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Normalize medication data to ensure consistent structure across the application
  const normalizeMedicationData = (medications: any): any[] => {
    try {
      if (!medications) return [];
      
      // Handle case where medications might be a string
      if (typeof medications === 'string') {
        console.log('Converting string medication to object:', medications);
        return [{
          id: 1,
          genericName: medications,
          brandName: '',
          strength: '',
          dosageForm: '',
          sigInstructions: '',
          quantity: '',
          refills: '',
          specialInstructions: ''
        }];
      }
      
      // Process array of medications
      if (Array.isArray(medications)) {
        console.log('Normalizing array of medications:', JSON.stringify(medications, null, 2));
        
        return medications.map((med, index) => {
          // Handle string medications
          if (typeof med === 'string') {
            return {
              id: index + 1,
              genericName: med,
              brandName: '',
              strength: '',
              dosageForm: '',
              sigInstructions: '',
              quantity: '',
              refills: '',
              specialInstructions: ''
            };
          }
          
          // Ensure medication object has all required properties
          const processedMed = {
            id: med.id || index + 1,
            genericName: med.genericName || med.name || '',
            brandName: med.brandName !== undefined ? med.brandName : '',
            strength: med.strength || '',
            dosageForm: med.dosageForm || '',
            sigInstructions: med.sigInstructions || '',
            quantity: med.quantity || '',
            refills: med.refills || '',
            specialInstructions: med.specialInstructions || ''
          };
          
          console.log(`Normalized medication ${index + 1}:`, processedMed);
          return processedMed;
        });
      }
      
      // If it's neither a string nor an array, return an empty array
      console.warn('Medications is neither string nor array:', medications);
      return [];
    } catch (error) {
      console.error('Error normalizing medications:', error);
      return [];
    }
  };

  // Load note by ID if provided
  useEffect(() => {
    async function loadNoteById() {
      if (!noteId) return;
      
      try {
        setLoading(true);
        const note = await getStructuredNoteById(noteId);
        
        if (note?.content) {
          console.log('Loaded note from database:', note.content);
          
          // Deep copy the content to avoid reference issues
          const contentCopy = JSON.parse(JSON.stringify(note.content));
          
          // Normalize medication data consistently
          if (contentCopy.medications) {
            console.log('Original medications data:', contentCopy.medications);
            contentCopy.medications = normalizeMedicationData(contentCopy.medications);
            console.log('Normalized medications data:', contentCopy.medications);
          }
          
          setStructuredData(contentCopy);
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
        
        // Deep copy and normalize the content
        const contentCopy = JSON.parse(JSON.stringify(existingData.content));
        
        // Process medications data consistently
        if (contentCopy.medications) {
          console.log('Original existing medications data:', contentCopy.medications);
          contentCopy.medications = normalizeMedicationData(contentCopy.medications);
          console.log('Normalized existing medications data:', contentCopy.medications);
        }
        
        setStructuredData(contentCopy);
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
