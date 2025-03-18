
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
  const [formattedVersions, setFormattedVersions] = useState<Array<{
    formatType: string;
    formattedText: string;
  }>>([]);
  
  const navigate = useNavigate();
  
  // Initialize state from location state or session storage
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
      
      // Get patient information
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
  
  // Save the edited transcription
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // For now, just update the local state since we don't have a persistence mechanism yet
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
  
  // Add a formatted version
  const addFormattedVersion = (formatType: string, formattedText: string) => {
    // Check if we already have a version with this format type
    const existingIndex = formattedVersions.findIndex(v => v.formatType === formatType);
    
    if (existingIndex >= 0) {
      // Replace existing format
      const updatedVersions = [...formattedVersions];
      updatedVersions[existingIndex] = { formatType, formattedText };
      setFormattedVersions(updatedVersions);
    } else {
      // Add new format
      setFormattedVersions([...formattedVersions, { formatType, formattedText }]);
    }
  };
  
  // Continue to structured output
  const handleContinueToStructured = useCallback((formatType?: string, formattedText?: string) => {
    // Add the formatted version if provided
    if (formatType && formattedText) {
      addFormattedVersion(formatType, formattedText);
    }
    
    // Setup data for next page
    const updatedTranscriptionData = transcriptionData ? {
      ...transcriptionData,
      text: transcriptionText,
      patient_id: patientId // Include patient ID in the transcription data
    } : null;
    
    // Navigate to structured output with all the necessary data
    navigate('/structured-output', {
      state: {
        transcriptionData: updatedTranscriptionData,
        audioUrl,
        transcriptionId,
        patientId, // Pass patient ID separately as well
        patientName, // Pass patient name
        formattedVersions: formattedVersions.length > 0 ? formattedVersions : undefined
      }
    });
  }, [navigate, transcriptionData, transcriptionText, audioUrl, transcriptionId, patientId, patientName, formattedVersions]);
  
  return {
    transcriptionText,
    transcriptionData,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    formattedVersions,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured,
    addFormattedVersion
  };
};
