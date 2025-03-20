
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';
import { getStructuredNoteById } from '@/services/structuredNoteService';

interface UseNoteLoaderProps {
  patientInfo: {
    id: string | null;
    name: string | null;
  };
}

export const useNoteLoader = ({ patientInfo }: UseNoteLoaderProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;

  // Function to force a data refresh with improved logging
  const refreshData = () => {
    console.log('Data refresh requested - incrementing refresh key');
    // Force UI to update by incrementing the refresh key
    setDataRefreshKey(prev => prev + 1);
    // Clear any existing errors on refresh
    setError(null);
  };

  // Normalize medication data to ensure consistent structure
  const normalizeMedicationData = (medications: any[]): any[] => {
    if (!medications || !Array.isArray(medications)) return [];
    
    console.log('Normalizing medication data:', JSON.stringify(medications, null, 2));
    
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
      
      // Handle medication objects - ensure all required properties exist
      return {
        id: med.id || index + 1,
        genericName: med.genericName || med.name || '',
        brandName: med.brandName || '',
        strength: med.strength || '',
        dosageForm: med.dosageForm || '',
        sigInstructions: med.sigInstructions || '',
        quantity: med.quantity || '',
        refills: med.refills || '',
        specialInstructions: med.specialInstructions || ''
      };
    });
  };

  // Load data on component mount or when refreshData is called
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          console.log(`Loading note with ID: ${noteId}, refresh key: ${dataRefreshKey}`);
          setLoading(true);
          
          // Add a small delay to ensure database consistency
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
            console.log('Loaded note from database:', JSON.stringify(note.content, null, 2));
            
            // Create a deep copy of the content to avoid reference issues
            const contentCopy = JSON.parse(JSON.stringify(note.content));
            
            // Normalize medication data specifically
            if (contentCopy.medications) {
              console.log('Original loaded medications:', contentCopy.medications);
              contentCopy.medications = normalizeMedicationData(contentCopy.medications);
              console.log('Normalized loaded medications:', contentCopy.medications);
            }
            
            setStructuredData(contentCopy);
          } else {
            console.error('Note not found for ID:', noteId);
            setError('Note not found');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          setError('Error loading note');
        } finally {
          setLoading(false);
        }
      } else if (location.state?.structuredData) {
        console.log('Using structured data from location state:', location.state.structuredData);
        
        // Deep copy and normalize the location state data
        const contentCopy = JSON.parse(JSON.stringify(location.state.structuredData));
        
        // Normalize medication data
        if (contentCopy.medications) {
          console.log('Original state medications:', contentCopy.medications);
          contentCopy.medications = normalizeMedicationData(contentCopy.medications);
          console.log('Normalized state medications:', contentCopy.medications);
        }
        
        setStructuredData(contentCopy);
        setLoading(false);
      } else if (transcriptionData && transcriptionData.text) {
        // Just mark as not loading - processTranscription will be called separately
        setLoading(false);
      } else {
        setLoading(false);
        setError('No transcription data found');
      }
    };

    loadNote();
  }, [noteId, location.state, transcriptionData, dataRefreshKey]);

  return {
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
  };
};
