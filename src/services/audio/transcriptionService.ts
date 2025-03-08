
import { supabase } from '@/integrations/supabase/client';
import { TranscriptionResult } from './types';

/**
 * Transcribes an audio file using the OpenAI Whisper API
 * @param audioUrl The URL of the audio file to transcribe
 * @returns The transcription result
 */
export const transcribeAudio = async (audioUrl: string): Promise<TranscriptionResult> => {
  try {
    // Ensure user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error('Authentication error. Please log in again.');
    }
    
    // Add a short delay to ensure the file is available
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Initialize transcription attempt
    let attempts = 0;
    const maxAttempts = 2;
    let lastError: Error | null = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`Transcription attempt ${attempts} for URL: ${audioUrl}`);
        
        const { data, error } = await supabase.functions.invoke('openai-whisper', {
          body: { audioUrl },
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        });
        
        if (error) {
          console.error(`Transcription attempt ${attempts} failed:`, error);
          lastError = new Error(error.message);
          // Wait longer before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        if (!data || !data.transcription) {
          console.error(`No transcription data returned in attempt ${attempts}`);
          lastError = new Error('No transcription data returned');
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw lastError;
        }
        
        console.log('Transcription successful, updating record');
        
        // Update the transcription record with the transcribed text
        const { error: updateError } = await supabase
          .from('transcriptions')
          .update({ 
            text: data.transcription,
            // Add additional metadata if available
            ...(data.duration && { duration: data.duration }),
            ...(data.language && { language: data.language })
          })
          .eq('audio_url', audioUrl)
          .eq('user_id', sessionData.session.user.id);
            
        if (updateError) {
          console.error('Error updating transcription record:', updateError);
          throw new Error(`Failed to update transcription: ${updateError.message}`);
        }
        
        return {
          text: data.transcription,
          duration: data.duration,
          language: data.language
        };
      } catch (attemptError) {
        lastError = attemptError instanceof Error ? attemptError : new Error(String(attemptError));
        if (attempts >= maxAttempts) {
          throw lastError;
        }
      }
    }
    
    throw lastError || new Error('Transcription failed after multiple attempts');
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
