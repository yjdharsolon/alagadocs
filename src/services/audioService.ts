
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an audio file to Supabase storage
 * @param file The audio file to upload
 * @returns An object containing the URL and ID of the uploaded file
 */
export const uploadAudio = async (file: File): Promise<{ url: string; id: string }> => {
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
  let transcriptionId = '';
  const user = supabase.auth.getUser();
  
  if ((await user).data.user) {
    const { data: transcription, error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        audio_url: publicUrl,
        user_id: (await user).data.user?.id,
        text: '' // Empty text initially, will be filled after transcription
      })
      .select('id')
      .single();
      
    if (transcriptionError) {
      console.error('Error creating transcription record:', transcriptionError);
    } else if (transcription) {
      transcriptionId = transcription.id;
    }
  }
  
  return { 
    url: publicUrl,
    id: transcriptionId
  };
};
