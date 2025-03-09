
import { supabase } from '@/integrations/supabase/client';
import { getPoliciesForTable } from './policyService';

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
    
    // Explicitly set the owner to the current user ID
    const userId = sessionData.session.user.id;
    
    // Upload options with metadata
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    };
    
    console.log('Starting file upload with authenticated user:', userId);
    
    // Create the transcription record FIRST, before attempting upload
    // This is a proven pattern for working with RLS policies
    console.log('Creating transcription record before upload');
    
    // Get public URL pattern for the file that will be uploaded
    const { data: { publicUrl } } = supabase.storage
      .from('transcriptions')
      .getPublicUrl(filePath);
    
    // Force a refresh of the session to ensure we have the latest token
    console.log('Refreshing session before creating transcription record');
    await supabase.auth.refreshSession();
    
    // Create the transcription record first
    console.log('Inserting transcription record with initial status: pending');
    const { data: insertData, error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        audio_url: publicUrl,
        user_id: userId,
        text: '', // Empty text initially, will be filled after transcription
        status: 'pending'
      })
      .select();
        
    if (transcriptionError) {
      console.error('Error creating initial transcription record:', transcriptionError);
      throw new Error(`Failed to create transcription record: ${transcriptionError.message}`);
    }
    
    console.log('Created initial transcription record:', insertData);
    
    // Wait a moment for the database to process the insert
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Now upload the file
    console.log('Now uploading file to storage');
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        console.log(`Upload attempt ${attempts} for file: ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('transcriptions')
          .upload(filePath, file, uploadOptions);
          
        if (error) {
          console.error(`Upload attempt ${attempts} failed:`, error);
          
          if (attempts >= maxAttempts) {
            throw error;
          }
          
          // Wait longer between retries
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
        
        console.log('File uploaded successfully:', data);
        
        return publicUrl;
      } catch (uploadError) {
        console.error(`Error in upload attempt ${attempts}:`, uploadError);
        
        if (attempts >= maxAttempts) {
          throw new Error(`Upload failed after ${maxAttempts} attempts: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    throw new Error('Upload failed after multiple attempts');
  } catch (error) {
    console.error('Error in uploadAudio:', error);
    throw error;
  }
};
