
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an audio file to Supabase storage
 * @param file The audio file to upload
 * @returns The public URL of the uploaded file
 */
export const uploadAudio = async (file: File): Promise<string> => {
  try {
    // Get the current user session first to ensure authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication error:', sessionError || 'No active session');
      throw new Error('Authentication error. Please log in again.');
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `audio/${fileName}`;
    
    // Upload options with metadata
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    };
    
    // Upload file to Supabase storage with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const { data, error } = await supabase.storage
          .from('transcriptions')
          .upload(filePath, file, uploadOptions);
          
        if (error) {
          if (attempts < maxAttempts) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw error;
        }
        
        // Success - get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('transcriptions')
          .getPublicUrl(filePath);
        
        // Create a record in the transcriptions table
        const { error: transcriptionError } = await supabase
          .from('transcriptions')
          .insert({
            audio_url: publicUrl,
            user_id: sessionData.session.user.id, // Explicitly set the user_id from the session
            text: '' // Empty text initially, will be filled after transcription
          });
            
        if (transcriptionError) {
          console.error('Error creating transcription record:', transcriptionError);
          throw new Error(`Failed to create transcription record: ${transcriptionError.message}`);
        }
        
        return publicUrl;
      } catch (uploadError) {
        if (attempts >= maxAttempts) {
          console.error('Error uploading after multiple attempts:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
        }
      }
    }
    
    throw new Error('Upload failed after multiple attempts');
  } catch (error) {
    console.error('Error in uploadAudio:', error);
    throw error;
  }
};

/**
 * Transcribes an audio file using the OpenAI Whisper API
 * @param audioUrl The URL of the audio file to transcribe
 * @returns The transcription result
 */
export const transcribeAudio = async (audioUrl: string) => {
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
    let lastError = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const { data, error } = await supabase.functions.invoke('openai-whisper', {
          body: { audioUrl },
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        });
        
        if (error) {
          lastError = error;
          // Wait longer before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        if (!data || !data.transcription) {
          lastError = new Error('No transcription data returned');
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw lastError;
        }
        
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
        lastError = attemptError;
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

/**
 * Fetches a list of a user's transcriptions
 */
export const getUserTranscriptions = async () => {
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
 */
export const updateTranscriptionText = async (id: string, text: string) => {
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
