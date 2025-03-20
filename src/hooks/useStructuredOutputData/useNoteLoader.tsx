
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

  // Function to force a data refresh
  const refreshData = () => {
    setDataRefreshKey(prev => prev + 1);
  };

  // Load data on component mount or when refreshData is called
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          setLoading(true);
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
            console.log('Loaded note from database:', note.content);
            // For medications, ensure we log what was received
            if (note.content.medications) {
              console.log('Loaded medications:', note.content.medications);
            }
            setStructuredData(note.content);
          } else {
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
        // For medications, ensure we log what was received
        if (location.state.structuredData.medications) {
          console.log('State medications:', location.state.structuredData.medications);
        }
        setStructuredData(location.state.structuredData);
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
