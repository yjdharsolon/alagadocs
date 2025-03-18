
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTranscriptionEdit = (locationState: any) => {
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcriptionId, setTranscriptionId] = useState<string>('');
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const navigate = useNavigate();

  // Initialize state from location state
  useEffect(() => {
    if (locationState) {
      if (locationState.transcriptionData) {
        setTranscriptionData(locationState.transcriptionData);
        setTranscriptionText(locationState.transcriptionData.text || '');
      }
      
      if (locationState.audioUrl) {
        setAudioUrl(locationState.audioUrl);
      }
      
      if (locationState.transcriptionId) {
        setTranscriptionId(locationState.transcriptionId);
      }
      
      if (locationState.patientId) {
        setPatientId(locationState.patientId);
      }
      
      if (locationState.patientName) {
        setPatientName(locationState.patientName);
      }
    }
    
    // If we don't have patient info from location state, try session storage
    if (!locationState?.patientId) {
      try {
        const storedPatient = sessionStorage.getItem('selectedPatient');
        if (storedPatient) {
          const patientData = JSON.parse(storedPatient);
          setPatientId(patientData.id);
          setPatientName(`${patientData.first_name} ${patientData.last_name}`);
        }
      } catch (error) {
        console.error('Error retrieving patient from sessionStorage:', error);
      }
    }
  }, [locationState]);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (transcriptionData) {
        const updatedData = {
          ...transcriptionData,
          text: transcriptionText
        };
        
        setTranscriptionData(updatedData);
        setSaveSuccess(true);
        toast.success('Transcription updated successfully');
      }
    } catch (err) {
      console.error('Error saving transcription:', err);
      setError('Failed to save transcription');
      toast.error('Failed to save transcription');
    } finally {
      setIsSaving(false);
    }
  }, [transcriptionData, transcriptionText]);
  
  const handleContinueToStructured = () => {
    // Setup data for next page
    const updatedTranscriptionData = {
      ...transcriptionData,
      text: transcriptionText
    };
    
    // Navigate with the text that should be structured
    navigate('/structured-output', {
      state: {
        transcriptionData: updatedTranscriptionData,
        audioUrl,
        transcriptionId,
        patientId,
        patientName
      }
    });
  };

  return {
    transcriptionText,
    transcriptionData,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  };
};
