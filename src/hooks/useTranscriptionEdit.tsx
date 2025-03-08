import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { updateTranscriptionText } from '@/services/audio';

interface TranscriptionState {
  transcriptionData: {
    text: string;
    duration?: number;
    language?: string;
  };
  audioUrl: string;
  transcriptionId: string;
}

export const useTranscriptionEdit = (locationState: any) => {
  const [transcriptionText, setTranscriptionText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [transcriptionId, setTranscriptionId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!locationState) {
      navigate('/upload');
      return;
    }

    const { transcriptionData, audioUrl, transcriptionId } = locationState as TranscriptionState;
    
    if (!transcriptionData || !transcriptionData.text) {
      navigate('/upload');
      return;
    }

    setTranscriptionText(transcriptionData.text);
    setAudioUrl(audioUrl || '');
    setTranscriptionId(transcriptionId || '');
  }, [locationState, navigate]);

  useEffect(() => {
    let timer: number;
    if (saveSuccess) {
      timer = window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [saveSuccess]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);
      
      if (!transcriptionId) {
        throw new Error('No transcription ID available');
      }
      
      await updateTranscriptionText(transcriptionId, transcriptionText);
      
      toast.success('Transcription saved successfully');
      setSaveSuccess(true);
    } catch (err) {
      console.error('Error saving transcription:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToStructured = () => {
    navigate('/structured-output', {
      state: {
        transcriptionData: {
          text: transcriptionText,
          ...(locationState?.transcriptionData?.duration && { 
            duration: locationState.transcriptionData.duration 
          }),
          ...(locationState?.transcriptionData?.language && { 
            language: locationState.transcriptionData.language 
          })
        },
        audioUrl,
        transcriptionId
      }
    });
  };

  return {
    transcriptionText,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  };
};
