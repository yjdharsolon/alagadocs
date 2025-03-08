
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
      .insert([
        { 
          audio_url: publicUrl,
          user_id: (await user).data.user?.id,
          status: 'uploaded'
        }
      ])
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

/**
 * Transcribes audio from a URL using OpenAI Whisper API
 * @param audioUrl The URL of the audio file to transcribe
 * @param transcriptionId Optional ID of the transcription record
 * @returns An object containing the transcription text and metadata
 */
export const transcribeAudio = async (
  audioUrl: string, 
  transcriptionId?: string
): Promise<{
  text: string;
  duration?: number;
  language?: string;
}> => {
  try {
    // Update transcription status if ID is provided
    if (transcriptionId) {
      await supabase
        .from('transcriptions')
        .update({ status: 'processing' })
        .eq('id', transcriptionId);
    }
    
    // Call the Supabase Edge Function for Whisper API
    const { data, error } = await supabase.functions.invoke('openai-whisper', {
      body: { audioUrl },
    });
    
    if (error) {
      console.error('Error calling transcription function:', error);
      
      // Update transcription status to failed if ID is provided
      if (transcriptionId) {
        await supabase
          .from('transcriptions')
          .update({ status: 'failed', error_message: error.message })
          .eq('id', transcriptionId);
      }
      
      throw new Error(`Error in transcription: ${error.message}`);
    }
    
    if (!data || !data.transcription) {
      const errorMsg = 'No transcription returned';
      
      // Update transcription status to failed if ID is provided
      if (transcriptionId) {
        await supabase
          .from('transcriptions')
          .update({ status: 'failed', error_message: errorMsg })
          .eq('id', transcriptionId);
      }
      
      throw new Error(errorMsg);
    }
    
    // Update transcription record with the transcribed text if ID is provided
    if (transcriptionId) {
      await supabase
        .from('transcriptions')
        .update({ 
          text: data.transcription,
          status: 'completed',
          duration: data.duration,
          language: data.language || 'en',
          completed_at: new Date().toISOString()
        })
        .eq('id', transcriptionId);
    }
    
    return {
      text: data.transcription,
      duration: data.duration,
      language: data.language
    };
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

/**
 * Structures a transcription into medical format using GPT
 * @param transcription The raw transcription text
 * @param userRole The role of the user (doctor, nurse, therapist)
 * @param customTemplate Optional custom template for structuring
 * @returns The structured text in medical documentation format
 */
export const structureText = async (
  transcription: string, 
  userRole: string = 'Doctor',
  customTemplate?: { sections: string[] }
): Promise<any> => {
  try {
    // Call the OpenAI Structure Text function to structure the text
    const { data, error } = await supabase.functions.invoke('openai-structure-text', {
      body: { 
        text: transcription,
        role: userRole,
        template: customTemplate
      },
    });
    
    if (error) {
      console.error('Error structuring text:', error);
      throw new Error(`Error in text structuring: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No structured text returned');
    }
    
    return data;
  } catch (error: any) {
    console.error('Text structuring error:', error);
    throw new Error(`Text structuring failed: ${error.message}`);
  }
};

/**
 * Saves a structured note to the user's account
 * @param userId The ID of the user
 * @param title The title of the note
 * @param content The content of the note (structured text)
 * @returns The ID of the saved note
 */
export const saveStructuredNote = async (
  userId: string,
  title: string,
  content: object
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        { 
          user_id: userId, 
          title, 
          content
        }
      ])
      .select('id')
      .single();
      
    if (error) {
      console.error('Error saving structured note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    return data.id;
  } catch (error: any) {
    console.error('Save note error:', error);
    throw new Error(`Failed to save note: ${error.message}`);
  }
};

/**
 * Retrieves saved notes for a user
 * @param userId The ID of the user
 * @returns An array of saved notes
 */
export const getUserNotes = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user notes:', error);
      throw new Error(`Error fetching notes: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Fetch notes error:', error);
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
};

/**
 * Gets a single transcription by ID
 * @param transcriptionId The ID of the transcription
 * @returns The transcription data
 */
export const getTranscriptionById = async (transcriptionId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', transcriptionId)
      .single();
      
    if (error) {
      console.error('Error fetching transcription:', error);
      throw new Error(`Error fetching transcription: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Fetch transcription error:', error);
    throw new Error(`Failed to fetch transcription: ${error.message}`);
  }
};
