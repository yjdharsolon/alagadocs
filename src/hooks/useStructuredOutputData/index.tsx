
import { usePatientInfo } from './usePatientInfo';
import { useNoteLoader } from './useNoteLoader';
import { useFormatGeneration } from './useFormatGeneration';
import { useFormatManagement } from './useFormatManagement';
import { MedicalSections } from '@/components/structured-output/types';

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

  // Direct update function to update the UI without relying on database refresh
  const updateDataDirectly = (updatedData: MedicalSections) => {
    console.log('Directly updating UI with saved data');
    
    // Update the core structured data
    setStructuredData(updatedData);
    
    // If we have formatted versions, update the appropriate one
    if (formattedVersions.length > 0 && activeFormatType) {
      console.log('Updating formatted version for type:', activeFormatType);
      
      const updatedFormats = formattedVersions.map(format => {
        if (format.formatType === activeFormatType) {
          return {
            ...format,
            structuredData: updatedData
          };
        }
        return format;
      });
      
      setFormattedVersions(updatedFormats);
    }
  };

  // Create a dedicated refresh function that ensures complete data reload
  const handleCompleteRefresh = () => {
    console.log('Performing complete data refresh');
    
    // Force a complete reload of data first
    refreshNoteData();
    
    // If there are formatted versions, we need to make sure they also get refreshed
    if (formattedVersions.length > 0 && activeFormatType) {
      // Find the currently active format
      const currentFormat = formattedVersions.find(f => f.formatType === activeFormatType);
      if (currentFormat) {
        console.log('Refreshing active format:', activeFormatType);
        
        // Update the UI with the current format data after a short delay
        // This delay ensures the base data has been refreshed first
        setTimeout(() => {
          console.log('Setting structured data from active format');
          setStructuredData(currentFormat.structuredData);
          
          // After updating the structured data, update the formatted versions
          // This ensures all formats reflect the latest data
          setTimeout(() => {
            if (structuredData) {
              console.log('Regenerating formatted versions with latest data');
              generateFormats();
            }
          }, 200);
        }, 300);
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
    refreshData: handleCompleteRefresh,  // Keep the original refresh function
    updateDataDirectly  // Add the new direct update function
  };
};
