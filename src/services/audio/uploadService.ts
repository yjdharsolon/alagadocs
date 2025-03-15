
import { supabase } from '@/integrations/supabase/client';

export const uploadAudio = async (file: File, patientId?: string): Promise<string> => {
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
    const filePath = `${sessionData.session.user.id}/${fileName}`;
    
    // Explicitly set the owner to the current user ID
    const userId = sessionData.session.user.id;
    
    // Upload options with metadata
    const uploadOptions = {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    };
    
    console.log('Starting file upload with authenticated user:', userId);
    console.log('File path for upload:', filePath);
    
    // Get public URL pattern for the file that will be uploaded
    const { data: { publicUrl } } = supabase.storage
      .from('transcriptions')
      .getPublicUrl(filePath);
    
    // Create the transcription record first
    console.log('Creating initial transcription record');
    
    // Create a minimal transcription record with required fields only
    const transcriptionData = {
      audio_url: publicUrl,
      user_id: userId,
      text: '', // Empty text initially, will be filled after transcription
      status: 'pending',
      patient_id: patientId || null // Associate with patient if provided
    };
    
    const { data: insertData, error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert(transcriptionData)
      .select();
        
    if (transcriptionError) {
      console.error('Error creating initial transcription record:', transcriptionError);
      throw new Error(`Failed to create transcription record: ${transcriptionError.message}`);
    }
    
    console.log('Created initial transcription record:', insertData);
    
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
            // Return the URL anyway if we have a transcription record
            if (insertData) {
              console.log('All upload attempts failed, but transcription record exists. Proceeding with URL.');
              return publicUrl;
            }
            throw error;
          }
          continue;
        }
        
        console.log('File uploaded successfully:', data);
        return publicUrl;
      } catch (uploadError) {
        console.error(`Error in upload attempt ${attempts}:`, uploadError);
        
        if (insertData) {
          console.log('Upload failed, but transcription record exists. Proceeding with transcription.');
          return publicUrl;
        }
        
        if (attempts >= maxAttempts) {
          throw new Error(`Upload failed after ${maxAttempts} attempts: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }
    }
    
    // If we get here with insertData, return the URL even though uploads failed
    if (insertData) {
      console.log('All upload attempts failed, but transcription record exists. Proceeding with URL.');
      return publicUrl;
    }
    
    throw new Error('Upload failed after multiple attempts');
  } catch (error) {
    console.error('Error in uploadAudio:', error);
    throw error;
  }
};
