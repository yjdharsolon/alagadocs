
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
    refreshData: refreshNoteData
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

  // Create a dedicated refresh function that ensures complete data reload
  const handleCompleteRefresh = () => {
    console.log('Performing complete data refresh');
    
    // Force a complete reload of data
    refreshNoteData();
    
    // If there are formatted versions, also refresh the active format
    if (formattedVersions.length > 0 && activeFormatType) {
      // Find the currently active format and reload it
      const currentFormat = formattedVersions.find(f => f.formatType === activeFormatType);
      if (currentFormat) {
        console.log('Refreshing active format:', activeFormatType);
        
        // Update the UI with the current format data
        setTimeout(() => {
          console.log('Setting structured data from active format');
          setStructuredData(currentFormat.structuredData);
        }, 100);
      }
    }
  };

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
    refreshData: handleCompleteRefresh  // Use the enhanced refresh function
  };
};
