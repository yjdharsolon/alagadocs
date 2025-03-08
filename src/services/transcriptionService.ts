
import { supabase } from '@/integrations/supabase/client';

/**
 * Transcribes an audio file using OpenAI Whisper
 * @param audioUrl The URL of the audio file to transcribe
 * @returns The transcription and metadata
 */
export const transcribeAudio = async (audioUrl: string) => {
  try {
    console.log('Transcribing audio from URL:', audioUrl);
    
    const { data, error } = await supabase.functions.invoke('openai-whisper', {
      body: { audioUrl }
    });
    
    if (error) {
      console.error('Transcription error:', error);
      throw new Error(`Transcription error: ${error.message}`);
    }
    
    console.log('Transcription completed successfully');
    return data;
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
};

/**
 * Updates the transcription text in the database
 * @param transcriptionId The ID of the transcription record
 * @param text The transcribed text
 * @returns The updated transcription record
 */
export const updateTranscriptionText = async (transcriptionId: string, text: string) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .update({ text, updated_at: new Date().toISOString() })
      .eq('id', transcriptionId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transcription text:', error);
      throw new Error(`Error updating transcription: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateTranscriptionText:', error);
    throw error;
  }
};

/**
 * Gets a transcription record by ID
 * @param transcriptionId The ID of the transcription to retrieve
 * @returns The transcription record
 */
export const getTranscription = async (transcriptionId: string) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', transcriptionId)
      .single();
      
    if (error) {
      console.error('Error fetching transcription:', error);
      throw new Error(`Error fetching transcription: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTranscription:', error);
    throw error;
  }
};

/**
 * Gets all transcriptions for a user
 * @param userId The ID of the user
 * @returns An array of transcription records
 */
export const getUserTranscriptions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user transcriptions:', error);
      throw new Error(`Error fetching transcriptions: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserTranscriptions:', error);
    throw error;
  }
};
