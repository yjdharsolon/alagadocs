
import { useState, useEffect } from 'react';
import { MedicalSections, TextTemplate } from '@/components/structured-output/types';
import { getStructuredNote } from '@/services/structuredTextService';

interface UseStructuredNoteDataParams {
  transcriptionData: any;
  transcriptionId: string;
}

export const useStructuredNoteData = ({ 
  transcriptionData, 
  transcriptionId 
}: UseStructuredNoteDataParams) => {
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing structured note
  const checkExistingNote = async () => {
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
