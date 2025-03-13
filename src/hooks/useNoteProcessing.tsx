
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { structureText, saveStructuredNote } from '@/services/structuredTextService';
import toast from 'react-hot-toast';

interface UseNoteProcessingParams {
  userId: string | undefined;
  setLoading: (loading: boolean) => void;
  setProcessingText: (processing: boolean) => void;
  setStructuredData: (data: MedicalSections | null) => void;
  setError: (error: string | null) => void;
}

export const useNoteProcessing = ({
  userId,
  setLoading,
  setProcessingText,
  setStructuredData,
  setError
}: UseNoteProcessingParams) => {
  
  const processTranscriptionText = async (
    text: string,
    transcriptionId: string,
    userRole: string,
    selectedTemplate: any
  ) => {
    if (!userId) {
      setError('You must be logged in to process transcriptions');
      setLoading(false);
      return false;
    }
    
    try {
      setProcessingText(true);
      
      // Structure the text
      console.log('Structuring text with template:', selectedTemplate);
      const structuredResult = await structureText(
        text, 
        userRole,
        selectedTemplate
      );
      
      if (structuredResult) {
        console.log('Structured result received:', structuredResult);
        setStructuredData(structuredResult);
        
        try {
          // Save to database - don't stop execution if this fails
          await saveStructuredNote(userId, transcriptionId, structuredResult);
          toast.success('Medical notes structured successfully');
        } catch (saveError) {
          console.error('Error saving structured note:', saveError);
          // We still have the structured result, so just inform the user
          toast('Note structured but could not be saved. Some features may be limited.', {
            icon: '⚠️'
          });
        }
        
        return true;
      } else {
        throw new Error('No structured data returned');
      }
    } catch (error: any) {
      console.error('Error processing transcription:', error);
      setError(`Failed to structure the transcription: ${error.message}`);
      toast.error('Failed to structure the transcription. Please try again.');
      return false;
    } finally {
      setProcessingText(false);
      setLoading(false);
    }
  };

  const updateStructuredData = async (
    updatedData: MedicalSections,
    transcriptionId: string
  ) => {
    if (!userId || !transcriptionId) return;
    
    setStructuredData(updatedData);
    
    try {
      // Save to database
      await saveStructuredNote(userId, transcriptionId, updatedData);
      toast.success('Medical notes updated successfully');
    } catch (error) {
      console.error('Error saving updated notes:', error);
      toast.error('Failed to save updated notes');
    }
  };

  return {
    processTranscriptionText,
    updateStructuredData
  };
};
