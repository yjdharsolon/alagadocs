
import { supabase } from '@/integrations/supabase/client';
import { TranscriptionResult } from './types';

/**
 * Transcribes an audio file using the OpenAI Whisper API
 */
export const transcribeAudio = async (audioUrl: string): Promise<TranscriptionResult> => {
  try {
    console.log('Starting transcription process for:', audioUrl);
    
    // Ensure user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      throw new Error('Authentication error. Please log in again.');
    }
    
    // Process the real transcription
    const transcriptionResult = await processRealTranscription(audioUrl, sessionData.session.access_token);
    
    // Update the transcription record with the transcribed text and duration
    await updateTranscriptionRecord(audioUrl, transcriptionResult, sessionData.session.user.id);
    
    console.log('Transcription record updated with text:', transcriptionResult.text.substring(0, 50) + '...');
    
    return transcriptionResult;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Processes an actual transcription request via the edge function
 */
const processRealTranscription = async (audioUrl: string, accessToken: string): Promise<TranscriptionResult> => {
  console.log('Calling OpenAI Whisper API via edge function');
  
  // Add a short delay to ensure the file is available
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Initialize transcription attempt with improved retry handling
  const maxAttempts = 5;
  const baseRetryDelay = 3000;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Transcription attempt ${attempt}/${maxAttempts} for URL: ${audioUrl}`);
      
      // Add cache-busting parameter to URL
      const cacheBuster = `cb=${Date.now()}`;
      const processUrl = audioUrl.includes('?') ? `${audioUrl}&${cacheBuster}` : `${audioUrl}?${cacheBuster}`;
      
      const { data, error } = await supabase.functions.invoke('openai-whisper', {
        body: { audioUrl: processUrl },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (error) {
        console.error(`Transcription attempt ${attempt} failed:`, error);
        
        if (attempt === maxAttempts) {
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        // Wait with exponential backoff before retrying
        const retryDelay = baseRetryDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      if (!data) {
        throw new Error('No data returned from transcription API');
      }
      
      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }
      
      // Validate the response contains the expected data
      if (!data.transcription) {
        throw new Error('Transcription data is missing from API response');
      }
      
      return {
        text: data.transcription,
        duration: data.duration || 0,
        language: data.language || 'en'
      };
    } catch (attemptError) {
      if (attempt === maxAttempts) {
        throw attemptError;
      }
    }
  }
  
  throw new Error('Failed to transcribe audio after multiple attempts');
};

/**
 * Updates the transcription record in the database with fallback handling
 */
const updateTranscriptionRecord = async (
  audioUrl: string, 
  transcriptionResult: TranscriptionResult, 
  userId: string
): Promise<void> => {
  console.log('Updating transcription record in database');
  
  try {
    // Build the update object with only fields we know exist
    const updateData: Record<string, any> = { 
      text: transcriptionResult.text,
      status: 'completed',
      completed_at: new Date().toISOString()
    };
    
    // Only add optional fields if they exist
    if (transcriptionResult.duration !== undefined) {
      updateData.duration = transcriptionResult.duration;
    }
    
    if (transcriptionResult.language) {
      updateData.language = transcriptionResult.language;
    }
    
    const { error: updateError } = await supabase
      .from('transcriptions')
      .update(updateData)
      .eq('audio_url', audioUrl)
      .eq('user_id', userId);
        
    if (updateError) {
      // Check if error is about missing columns and try without optional fields
      if (updateError.message.includes('column') && updateError.message.includes('does not exist')) {
        console.warn('Column missing in transcriptions table:', updateError.message);
        
        const fallbackUpdateData = { 
          text: transcriptionResult.text,
          status: 'completed',
          completed_at: new Date().toISOString()
        };
        
        const { error: fallbackError } = await supabase
          .from('transcriptions')
          .update(fallbackUpdateData)
          .eq('audio_url', audioUrl)
          .eq('user_id', userId);
          
        if (fallbackError) {
          throw fallbackError;
        }
      } else {
        throw updateError;
      }
    }
  } catch (error) {
    console.error('Error updating transcription record:', error);
    throw new Error(`Failed to update transcription: ${error.message}`);
  }
};
