
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an audio file to Supabase storage
 * @param file The audio file to upload
 * @returns The public URL of the uploaded file
 */
export const uploadAudio = async (file: File): Promise<string> => {
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
    
  // Create a record in the transcriptions table if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        audio_url: publicUrl,
        user_id: user.id,
        text: '' // Empty text initially, will be filled after transcription
      });
      
    if (transcriptionError) {
      console.error('Error creating transcription record:', transcriptionError);
    }
  }
  
  return publicUrl;
};
