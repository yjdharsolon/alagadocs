
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MedicalSections, StructuredNote, TextTemplate } from '@/components/structured-output/types';
import { useStructuredNoteData } from './useStructuredNoteData';
import { useTemplateSelection } from './useTemplateSelection';
import { useNoteProcessing } from './useNoteProcessing';
import { useNavigationActions } from './useNavigationActions';

interface UseStructuredOutputParams {
  transcriptionData: any;
  transcriptionId: string;
  audioUrl?: string;
}

export const useStructuredOutput = ({ 
  transcriptionData, 
  transcriptionId, 
  audioUrl 
}: UseStructuredOutputParams) => {
  const { user, getUserRole } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Use our smaller hooks
  const {
    loading,
    setLoading,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData,
    error,
    setError,
    checkExistingNote
  } = useStructuredNoteData({ transcriptionData, transcriptionId });
  
  const {
    templates,
    selectedTemplateId,
    handleTemplateSelect
  } = useTemplateSelection({ userId: user?.id });
  
  const {
    processTranscriptionText,
    updateStructuredData: updateNote
  } = useNoteProcessing({
    userId: user?.id,
    setLoading,
    setProcessingText,
    setStructuredData,
    setError
  });
  
  const {
    navigate,
    handleBackToTranscription,
    handleEdit
  } = useNavigationActions({
    transcriptionData,
    transcriptionId,
    audioUrl,
    structuredData
  });
  
  // Process transcription when data changes
  useEffect(() => {
    const processTranscription = async () => {
      if (!transcriptionData || !transcriptionId) {
        console.error('Missing required data:', { transcriptionData, transcriptionId });
        setError('Missing transcription data. Please go back and try again.');
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.error('No authenticated user');
        setError('You must be logged in to view structured notes.');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Processing transcription:', { id: transcriptionId, text: transcriptionData.text?.substring(0, 50) + '...' });
        
        // First check if we already have a structured note
        const hasExistingNote = await checkExistingNote();
        if (hasExistingNote) return;
        
        // Get user role and selected template
        const userRole = await getUserRole();
        console.log('User role:', userRole);
        
        // Get selected template if exists
        let selectedTemplate = null;
        if (selectedTemplateId) {
          selectedTemplate = templates.find(t => t.id === selectedTemplateId) || null;
        }
        
        // Process the transcription text
        await processTranscriptionText(
          transcriptionData.text,
          transcriptionId,
          userRole || 'Doctor',
          selectedTemplate
        );
      } catch (error: any) {
        console.error('Error in processTranscription:', error);
        setError(`Failed to process transcription: ${error.message}`);
        setLoading(false);
      }
    };
    
    processTranscription();
  }, [transcriptionData, transcriptionId, user, templates, selectedTemplateId]);
  
  // Template selection handler with reprocessing
  const handleTemplateSelection = (templateId: string) => {
    handleTemplateSelect(templateId);
    setLoading(true);
    setProcessingText(true);
    
    // Re-trigger the useEffect to reprocess with the new template
    const timer = setTimeout(() => {
      setLoading(false);
      setProcessingText(false);
    }, 3000); // Fallback timer
    
    return () => clearTimeout(timer);
  };
  
  // Update structured data wrapper
  const updateStructuredData = async (updatedData: StructuredNote) => {
    await updateNote(updatedData, transcriptionId);
  };
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  return {
    user,
    loading,
    processingText,
    structuredData,
    templates,
    error,
    isEditMode,
    handleBackToTranscription,
    handleTemplateSelect: handleTemplateSelection,
    handleEdit,
    updateStructuredData,
    handleToggleEditMode,
    navigate
  };
};
