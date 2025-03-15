import { useState, useEffect } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { getStructuredNoteById } from '@/services/structuredOutput';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';
import { useLocation, useSearchParams } from 'react-router-dom';

export const useStructuredOutputData = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;
  
  const statePatientId = location.state?.patientId;
  const statePatientName = location.state?.patientName;
  
  const transcriptionPatientId = transcriptionData?.patient_id;
  
  const [patientInfo, setPatientInfo] = useState<{id: string | null, name: string | null}>({
    id: null,
    name: null
  });

  // Initialize patient info from various sources
  useEffect(() => {
    if (statePatientId) {
      setPatientInfo({
        id: statePatientId,
        name: statePatientName || null
      });
      return;
    }
    
    if (transcriptionPatientId) {
      setPatientInfo({
        id: transcriptionPatientId,
        name: null
      });
      return;
    }
    
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patientData = JSON.parse(storedPatient);
        setPatientInfo({
          id: patientData.id,
          name: `${patientData.first_name} ${patientData.last_name}`
        });
      }
    } catch (error) {
      console.error('Error retrieving patient from sessionStorage:', error);
    }
  }, [statePatientId, statePatientName, transcriptionPatientId]);

  // Load data on component mount
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          setLoading(true);
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
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
        setStructuredData(location.state.structuredData);
        setLoading(false);
      } else if (transcriptionData && transcriptionData.text) {
        processTranscription();
      } else {
        setLoading(false);
        setError('No transcription data found');
      }
    };

    loadNote();
  }, [noteId, location.state, transcriptionData]);

  // Process transcription data
  const processTranscription = async () => {
    if (!transcriptionData || !transcriptionData.text) {
      setError('Missing transcription text');
      setLoading(false);
      return;
    }
    
    try {
      setProcessingText(true);
      console.log('Processing transcription:', transcriptionData.text);
      
      const structuredResult = await structureText(transcriptionData.text);
      
      if (structuredResult) {
        console.log('Structured result received:', structuredResult);
        setStructuredData(structuredResult);
        toast.success('Medical notes structured successfully');
      } else {
        throw new Error('No structured data returned');
      }
    } catch (error: any) {
      console.error('Error processing transcription:', error);
      setError(`Failed to structure the transcription: ${error.message}`);
      toast.error('Failed to structure the transcription');
    } finally {
      setProcessingText(false);
      setLoading(false);
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
    transcriptionId
  };
};
