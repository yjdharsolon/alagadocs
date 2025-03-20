
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { Json } from '@/integrations/supabase/types';
import { ensureUuid } from '@/utils/uuidUtils';

interface SaveUserNoteParams {
  userId: string;
  transcriptionId: string;
  content: MedicalSections;
  patientId?: string;
  formatType?: string;
}

/**
 * Saves a user note to the database
 * @param params The parameters for saving a user note
 * @returns The saved note data
 */
export const saveUserNote = async (params: SaveUserNoteParams): Promise<any> => {
  try {
    const {
      userId,
      transcriptionId,
      content,
      patientId,
      formatType = 'standard'
    } = params;

    console.log(`[saveUserNote] Saving note with format: ${formatType}`);
    console.log(`[saveUserNote] Patient ID: ${patientId || 'none'}`);
    
    // Ensure valid UUID format for DB
    const validUuid = ensureUuid(transcriptionId);
    
    // Insert into structured_notes table
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        user_id: userId,
        transcription_id: validUuid,
        content: content as unknown as Json, // Type cast to satisfy TypeScript
        original_id: transcriptionId, // Store the original ID for reference
        patient_id: patientId || null, // Associate with patient if provided
        format_type: formatType // Store the format type
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving user note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    console.log('User note saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveUserNote:', error);
    throw error;
  }
};

/**
 * Saves a structured note to the database
 * @param content The content of the note as a string
 * @returns The saved note data
 */
export const saveStructuredNote = async (content: string): Promise<any> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create a title from the first line or first few characters
    const title = content.split('\n')[0].substring(0, 50) || 'Untitled Note';
    
    // Create a new note record
    const { data, error } = await supabase
      .from('notes')
      .insert([
        { 
          user_id: user.id, 
          title, 
          content  // content is already a string
        }
      ])
      .select();
      
    if (error) {
      console.error('Error saving note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveStructuredNote:', error);
    throw error;
  }
};
