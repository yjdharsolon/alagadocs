
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';
import { useNoteProcessing } from '@/hooks/useNoteProcessing';
import { useStructuredNoteData } from '@/hooks/useStructuredNoteData';
import { useAuth } from '@/hooks/useAuth';
import { useErrorHandling } from './useErrorHandling';
import { useNavigationControl } from './useNavigationControl';
import { useEditMode } from './useEditMode';
import { toast } from 'sonner';
import { addCacheBuster } from '@/utils/urlUtils';

interface UseStructuredOutputPageParams {
  structuredData: MedicalSections | null;
  setStructuredData: (data: MedicalSections | null) => void;
  transcriptionData?: any;
  audioUrl?: string;
  error?: string | null;
  patientInfo?: {
    id: string | null;
    name: string | null;
  };
  transcriptionId?: string;
}

export const useStructuredOutputPage = ({
  structuredData,
  setStructuredData,
  transcriptionData,
  audioUrl,
  error,
  patientInfo,
  transcriptionId
}: UseStructuredOutputPageParams) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [noteSaved, setNoteSaved] = useState(false);
  
  // Initialize the edit mode hook with transcription and patient IDs
  const {
    isEditMode,
    handleToggleEditMode,
    handleSaveEdit,
    disableRefreshAfterSave
  } = useEditMode({ 
    setStructuredData, 
    transcriptionId,
    patientId: patientInfo?.id
  });
  
  // Initialize the note processing hook for handling retries
  const {
    processTranscriptionText,
    updateStructuredData
  } = useNoteProcessing({
    userId: user?.id,
    setLoading: () => {},
    setProcessingText: () => {},
    setStructuredData,
    setError: () => {}
  });
  
  // Handle retry when there's an error
  const handleRetry = useCallback(() => {
    if (!transcriptionData?.text) {
      toast.error('No transcription text available to retry');
      return;
    }
    
    processTranscriptionText(
      transcriptionData.text,
      transcriptionId || 'unknown',
      'Doctor',
      null
    );
  }, [transcriptionData, transcriptionId, processTranscriptionText]);
  
  // Use the error handling hook to handle errors
  const { handleError, retryProcessing } = useErrorHandling({ 
    handleRetry 
  });
  
  // Use the navigation control hook to handle navigation
  const { handleBackClick } = useNavigationControl({ 
    isEditMode, 
    onCancelEdit: handleToggleEditMode,
    transcriptionData,
    audioUrl
  });
  
  // Handle note saved
  const handleNoteSaved = useCallback(() => {
    setNoteSaved(true);
  }, []);
  
  // Handle end consult
  const handleEndConsult = useCallback(() => {
    console.log('[useStructuredOutputPage] handleEndConsult called');
    
    // Add cache buster to dashboard URL to force a refresh
    const dashboardUrl = addCacheBuster('/dashboard');
    navigate(dashboardUrl);
  }, [navigate]);
  
  return {
    isEditMode,
    handleBackClick,
    handleToggleEditMode,
    handleSaveEdit,
    handleRetry,
    handleNoteSaved,
    handleEndConsult,
    noteSaved,
    disableRefreshAfterSave
  };
};
