
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
    
    // First, ensure the bucket exists
    try {
      await supabase.functions.invoke('ensure-transcription-bucket');
      console.log('Bucket verification completed');
    } catch (bucketError) {
      console.error('Bucket verification error:', bucketError);
    }
    
    // Refresh the session token before upload
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Error refreshing session:', refreshError);
      throw new Error('Session refresh failed. Please log in again.');
    }
    
    // Upload the file to storage with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`Attempt ${attempts}: Uploading file to Supabase storage`);
        
        // Upload the file to storage
        const { data, error } = await supabase.storage
          .from('transcriptions')
          .upload(filePath, file, uploadOptions);
          
        if (error) {
          console.error(`Upload attempt ${attempts} failed:`, error);
          
          // Special handling for RLS policy violations
          if (error.message?.includes('row-level security policy')) {
            // Try to create the transcription record first
            console.log('Attempting alternative approach: Create record first then upload');
            
            // Get public URL pattern for the file that will be uploaded
            const { data: { publicUrl } } = supabase.storage
              .from('transcriptions')
              .getPublicUrl(filePath);
            
            // Create the transcription record first
            const { data: insertData, error: transcriptionError } = await supabase
              .from('transcriptions')
              .insert({
                audio_url: publicUrl,
                user_id: userId,
                text: '' // Empty text initially, will be filled after transcription
              })
              .select();
            
            if (transcriptionError) {
              console.error('Error creating initial transcription record:', transcriptionError);
              
              if (transcriptionError.message?.includes('row-level security policy')) {
                throw new Error('Permission error: RLS policy violation. Please log out and log in again.');
              }
              
              throw new Error(`Failed to create initial transcription record: ${transcriptionError.message}`);
            }
            
            console.log('Created initial transcription record, now trying upload again');
            
            // Now try the upload again
            const { data: retryData, error: retryError } = await supabase.storage
              .from('transcriptions')
              .upload(filePath, file, uploadOptions);
              
            if (retryError) {
              console.error('Second upload attempt failed:', retryError);
              throw retryError;
            }
            
            console.log('Alternative approach successful: File uploaded after record creation');
            return publicUrl;
          }
          
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
        
        console.log('File uploaded successfully by user:', userId);
        
        // Create a record in the transcriptions table
        const { data: insertData, error: transcriptionError } = await supabase
          .from('transcriptions')
          .insert({
            audio_url: publicUrl,
            user_id: userId,
            text: '' // Empty text initially, will be filled after transcription
          })
          .select();
            
        if (transcriptionError) {
          console.error('Error creating transcription record:', transcriptionError);
          
          if (transcriptionError.message?.includes('row-level security policy')) {
            throw new Error('Permission error: Cannot create transcription record due to RLS policy. Please log out and log in again.');
          }
          
          throw new Error(`Failed to create transcription record: ${transcriptionError.message}`);
        }
        
        console.log('Transcription record created successfully:', insertData);
        return publicUrl;
      } catch (uploadError) {
        if (attempts >= maxAttempts) {
          console.error('Error uploading after multiple attempts:', uploadError);
          throw new Error(`Upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }
    }
    
    throw new Error('Upload failed after multiple attempts');
  } catch (error) {
    console.error('Error in uploadAudio:', error);
    throw error;
  }
};
