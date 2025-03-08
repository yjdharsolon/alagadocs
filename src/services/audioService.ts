
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an audio file to Supabase storage
 * @param file The audio file to upload
 * @returns The public URL of the uploaded file
 */
export const uploadAudio = async (file: File): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `audio/${fileName}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('transcriptions')
      .upload(filePath, file);
      
    if (error) {
      console.error('Error uploading audio:', error);
      throw new Error(`Error uploading audio: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('transcriptions')
      .getPublicUrl(filePath);
    
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return publicUrl; // Still return the URL even if we can't create a record
    }
    
    // Only create a record if user is authenticated
    if (userData?.user) {
      // Create a record in the transcriptions table
      const { error: transcriptionError } = await supabase
        .from('transcriptions')
        .insert({
          audio_url: publicUrl,
          user_id: userData.user.id,
          text: '' // Empty text initially, will be filled after transcription
        });
          
      if (transcriptionError) {
        console.error('Error creating transcription record:', transcriptionError);
        // Don't throw here, we still want to return the URL
      }
    }
    
    return publicUrl;
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
    const { data, error } = await supabase.functions.invoke('openai-whisper', {
      body: { audioUrl }
    });
    
    if (error) {
      throw new Error(`Transcription error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
