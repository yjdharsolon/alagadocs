
import { supabase } from '@/integrations/supabase/client';
import { Transcription } from './types';

/**
 * Fetches a list of a user's transcriptions
 * @returns An array of the user's transcriptions
 */
export const getUserTranscriptions = async (): Promise<Transcription[]> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error('Authentication error. Please log in again.');
    }
    
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw new Error(`Error fetching transcriptions: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserTranscriptions:', error);
    throw error;
  }
};

/**
 * Updates the text of a transcription
 * @param id The ID of the transcription to update
 * @param text The new text for the transcription
 * @returns True if the update was successful
 */
export const updateTranscriptionText = async (id: string, text: string): Promise<boolean> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error('Authentication error. Please log in again.');
    }
    
    const { error } = await supabase
      .from('transcriptions')
      .update({ text })
      .eq('id', id)
      .eq('user_id', sessionData.session.user.id);
      
    if (error) {
      throw new Error(`Error updating transcription: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateTranscriptionText:', error);
    throw error;
  }
};
