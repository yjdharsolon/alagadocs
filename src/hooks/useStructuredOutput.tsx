
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';
import { toast } from 'sonner';

// This file is deprecated, use hooks/useStructuredOutput/index.tsx instead
// Keeping this file for backward compatibility

interface UseStructuredOutputPageParams {
  structuredData: MedicalSections | null;
  setStructuredData: (data: MedicalSections) => void;
  transcriptionData: any;
  audioUrl?: string;
  error: string | null;
}

export const useStructuredOutputPage = ({
  structuredData,
  setStructuredData,
  transcriptionData,
  audioUrl,
  error
}: UseStructuredOutputPageParams) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleBackClick = useCallback(() => {
    if (transcriptionData) {
      navigate('/edit-transcript', { 
        state: { 
          transcriptionData,
          audioUrl 
        } 
      });
    } else {
      navigate('/select-patient');
    }
  }, [navigate, transcriptionData, audioUrl]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const handleSaveEdit = useCallback((updatedData: MedicalSections, stayInEditMode = false) => {
    setStructuredData(updatedData);
    
    // Only exit edit mode if stayInEditMode is false
    if (!stayInEditMode) {
      setIsEditMode(false);
    }
    
    toast.success('Document changes saved successfully');
  }, [setStructuredData]);

  const handleRetry = useCallback(() => {
    if (!transcriptionData || !transcriptionData.text) {
      toast.error('No transcription data available');
      return;
    }
    
    // Redirect to transcription page to try again
    navigate('/transcribe', { 
      state: { 
        transcriptionData,
        audioUrl 
      } 
    });
  }, [navigate, transcriptionData, audioUrl]);

  const handleNoteSaved = useCallback(() => {
    setNoteSaved(true);
  }, []);

  const handleEndConsult = useCallback(() => {
    navigate('/select-patient');
  }, [navigate]);

  return {
    isEditMode,
    handleBackClick,
    handleToggleEditMode,
    handleSaveEdit,
    handleRetry,
    handleNoteSaved,
    handleEndConsult,
    noteSaved
  };
};
