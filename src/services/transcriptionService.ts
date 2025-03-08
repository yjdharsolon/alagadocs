
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an audio file to Supabase storage
 * @param file The audio file to upload
 * @returns The URL of the uploaded file
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
    
  return publicUrl;
};

/**
 * Transcribes audio from a URL using OpenAI Whisper API
 * @param audioUrl The URL of the audio file to transcribe
 * @returns The transcription text
 */
export const transcribeAudio = async (audioUrl: string): Promise<string> => {
  try {
    // Call the Supabase Edge Function for Whisper API
    const { data, error } = await supabase.functions.invoke('openai-whisper', {
      body: { audioUrl },
    });
    
    if (error) {
      console.error('Error calling transcription function:', error);
      throw new Error(`Error in transcription: ${error.message}`);
    }
    
    if (!data || !data.transcription) {
      throw new Error('No transcription returned');
    }
    
    return data.transcription;
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

/**
 * Structures a transcription into medical format using GPT
 * @param transcription The raw transcription text
 * @returns The structured text in medical documentation format
 */
export const structureText = async (transcription: string): Promise<string> => {
  try {
    const prompt = `
      As a medical professional, please structure the following medical transcription into a proper clinical note format with sections for:
      - Chief Complaint
      - History of Present Illness
      - Past Medical History
      - Medications
      - Allergies
      - Physical Examination
      - Assessment
      - Plan
      
      If a section has no relevant information in the transcription, you can write "Not mentioned". Here's the transcription:
      
      ${transcription}
    `;
    
    // Call the OpenAI Chat function to structure the text
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { prompt },
    });
    
    if (error) {
      console.error('Error structuring text:', error);
      throw new Error(`Error in text structuring: ${error.message}`);
    }
    
    if (!data || !data.message) {
      throw new Error('No structured text returned');
    }
    
    return data.message;
  } catch (error: any) {
    console.error('Text structuring error:', error);
    throw new Error(`Text structuring failed: ${error.message}`);
  }
};
