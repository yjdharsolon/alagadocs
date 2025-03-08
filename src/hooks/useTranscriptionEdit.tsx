
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TranscriptionState {
  transcriptionText: string;
  transcriptionId: string;
  audioUrl: string;
  isSaving: boolean;
}

interface LocationState {
  transcriptionText?: string;
  transcriptionData?: { text: string };
  transcriptionId?: string;
  audioUrl?: string;
}

export function useTranscriptionEdit(locationState: LocationState | null) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<TranscriptionState>({
    transcriptionText: '',
    transcriptionId: '',
    audioUrl: '',
    isSaving: false
  });
  
  useEffect(() => {
    if (!locationState) {
      toast.error('No transcription to edit. Please transcribe audio first.');
      navigate('/upload');
      return;
    }
    
    // Different ways the data might come in
    const textFromState = locationState.transcriptionText || 
                          (locationState.transcriptionData && locationState.transcriptionData.text) || 
                          '';
    const audioUrlFromState = locationState.audioUrl || '';
    const transcriptionIdFromState = locationState.transcriptionId || '';
    
    if (!textFromState) {
      toast.error('No transcription text found. Please transcribe audio first.');
      navigate('/upload');
      return;
    }
    
    setState(prev => ({
      ...prev,
      transcriptionText: textFromState,
      audioUrl: audioUrlFromState,
      transcriptionId: transcriptionIdFromState
    }));
  }, [locationState, navigate]);
  
  const setTranscriptionText = (text: string) => {
    setState(prev => ({ ...prev, transcriptionText: text }));
  };
  
  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save changes.');
      return;
    }
    
    setState(prev => ({ ...prev, isSaving: true }));
    try {
      // Update the transcription in the database if we have a transcription ID
      if (state.transcriptionId) {
        // Update existing transcription
        const { error } = await supabase
          .from('transcriptions')
          .update({ text: state.transcriptionText, updated_at: new Date().toISOString() })
          .eq('id', state.transcriptionId);
          
        if (error) throw error;
      } else if (state.transcriptionText && state.audioUrl) {
        // Create a new transcription if we don't have an ID but have text and audio URL
        const { data, error } = await supabase
          .from('transcriptions')
          .insert({ 
            text: state.transcriptionText, 
            audio_url: state.audioUrl,
            user_id: user.id
          })
          .select('id')
          .single();
          
        if (error) throw error;
        if (data) {
          setState(prev => ({ ...prev, transcriptionId: data.id }));
        }
      }
      
      toast.success('Transcription saved successfully');
    } catch (error: any) {
      console.error('Error saving transcription:', error);
      toast.error(`Failed to save transcription: ${error.message}`);
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };
  
  const handleContinueToStructured = () => {
    navigate('/structured-output', { 
      state: { 
        transcriptionData: { text: state.transcriptionText },
        transcriptionId: state.transcriptionId, 
        audioUrl: state.audioUrl 
      } 
    });
  };
  
  return {
    transcriptionText: state.transcriptionText,
    audioUrl: state.audioUrl,
    isSaving: state.isSaving,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  };
}
