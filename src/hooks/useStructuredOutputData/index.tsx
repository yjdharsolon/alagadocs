
import { usePatientInfo } from './usePatientInfo';
import { useNoteLoader } from './useNoteLoader';
import { useFormatGeneration } from './useFormatGeneration';
import { useFormatManagement } from './useFormatManagement';

export const useStructuredOutputData = () => {
  // Get patient info from various sources
  const { patientInfo } = usePatientInfo();
  
  // Load structured note data 
  const {
    loading,
    setLoading,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData,
    error,
    setError,
    transcriptionData,
    audioUrl,
    transcriptionId,
    location,
    noteId,
    refreshData
  } = useNoteLoader({ patientInfo });
  
  // Generate different format types
  const {
    formattedVersions,
    setFormattedVersions,
    generateFormats,
    processTranscription
  } = useFormatGeneration({
    transcriptionData,
    processingText,
    setProcessingText,
    structuredData,
    setStructuredData,
    setError,
    loading,
    noteId,
    setLoading
  });
  
  // Manage format selection and active format
  const {
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats
  } = useFormatManagement({
    formattedVersions,
    setFormattedVersions,
    setStructuredData
  });

  return {
    loading,
    processingText,
    structuredData,
    setStructuredData,
    error,
    patientInfo,
    transcriptionData,
    audioUrl,
    transcriptionId,
    formattedVersions,
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats,
    refreshData
  };
};
