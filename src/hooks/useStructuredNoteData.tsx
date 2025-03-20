
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
          
          // Log and normalize medication data specifically
          if (contentCopy.medications) {
            console.log('Original medications data:', contentCopy.medications);
            
            // If medications is an array, ensure each item has the required properties
            if (Array.isArray(contentCopy.medications)) {
              contentCopy.medications = contentCopy.medications.map((med: any, index: number) => {
                const processedMed = typeof med === 'string' 
                  ? { genericName: med, brandName: '', id: index + 1 } 
                  : { ...med, id: med.id || index + 1 };
                
                // Ensure all medication objects have the expected properties
                return {
                  genericName: processedMed.genericName || processedMed.name || '',
                  brandName: processedMed.brandName || '',
                  strength: processedMed.strength || '',
                  dosageForm: processedMed.dosageForm || '',
                  sigInstructions: processedMed.sigInstructions || '',
                  quantity: processedMed.quantity || '',
                  refills: processedMed.refills || '',
                  specialInstructions: processedMed.specialInstructions || '',
                  id: processedMed.id
                };
              });
              
              console.log('Normalized medications data:', contentCopy.medications);
            }
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
        
        // Process medications data if present
        if (contentCopy.medications) {
          console.log('Original existing medications data:', contentCopy.medications);
          
          if (Array.isArray(contentCopy.medications)) {
            contentCopy.medications = contentCopy.medications.map((med: any, index: number) => {
              const processedMed = typeof med === 'string' 
                ? { genericName: med, brandName: '', id: index + 1 } 
                : { ...med, id: med.id || index + 1 };
              
              // Ensure all medication objects have the expected properties
              return {
                genericName: processedMed.genericName || processedMed.name || '',
                brandName: processedMed.brandName || '',
                strength: processedMed.strength || '',
                dosageForm: processedMed.dosageForm || '',
                sigInstructions: processedMed.sigInstructions || '',
                quantity: processedMed.quantity || '',
                refills: processedMed.refills || '',
                specialInstructions: processedMed.specialInstructions || '',
                id: processedMed.id
              };
            });
            
            console.log('Normalized existing medications data:', contentCopy.medications);
          }
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
