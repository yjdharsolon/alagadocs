
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { Json } from '@/integrations/supabase/types';
import { ensureUuid } from '@/utils/uuidUtils';

/**
 * Saves structured note to the database
 * @param userId The user ID associated with the note
 * @param transcriptionId The ID of the source transcription
 * @param content The structured note content
 * @param patientId Optional patient ID to associate with the note
 * @returns The saved note data
 */
export const saveStructuredNote = async (
  userId: string,
  transcriptionId: string,
  content: MedicalSections,
  patientId?: string | null
): Promise<any> => {
  try {
    // Ensure transcriptionId is a valid UUID before inserting
    const validUuid = ensureUuid(transcriptionId);
    console.log(`Original transcriptionId: ${transcriptionId}, converted to UUID: ${validUuid}`);
    console.log('Saving note with patientId:', patientId);
    
    // Insert into structured_notes table with correct UUID format
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        user_id: userId,
        transcription_id: validUuid,
        content: content as unknown as Json, // Type cast to satisfy TypeScript
        original_id: transcriptionId, // Store the original ID for reference
        patient_id: patientId || null // Associate with patient if provided
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving structured note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    console.log('Structured note saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveStructuredNote:', error);
    throw error;
  }
};

/**
 * Retrieves a structured note from the database
 * @param transcriptionId The ID of the related transcription
 * @returns The structured note data
 */
export const getStructuredNote = async (transcriptionId: string): Promise<any> => {
  try {
    // Ensure we have a valid UUID for querying
    const validUuid = ensureUuid(transcriptionId);
    console.log(`Getting note - Original ID: ${transcriptionId}, UUID: ${validUuid}`);
    
    // Query by the validated UUID
    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('transcription_id', validUuid)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching structured note:', error);
      throw new Error(`Error fetching note: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getStructuredNote:', error);
    throw error;
  }
};

/**
 * Get a structured note by ID
 * @param noteId The ID of the structured note to retrieve
 * @returns The structured note
 */
export const getStructuredNoteById = async (noteId: string): Promise<{ 
  id: string;
  content: MedicalSections;
  transcription_id: string;
  patient_id?: string | null;
  created_at: string;
}> => {
  try {
    // Ensure user is authenticated before trying to fetch the note
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User must be authenticated to get structured notes');
    }

    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('id', noteId)
      .maybeSingle();
      
    if (error) {
      console.error('Error getting structured note:', error);
      throw new Error(`Error getting structured note: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('Structured note not found');
    }
    
    console.log('Retrieved structured note by ID:', data);
    return {
      ...data,
      content: data.content as unknown as MedicalSections
    };
  } catch (error) {
    console.error('Error in getStructuredNoteById:', error);
    throw error;
  }
};

/**
 * Get all structured notes for the current user
 * @returns Array of structured notes
 */
export const getUserStructuredNotes = async (): Promise<{
  id: string;
  content: MedicalSections;
  transcription_id: string;
  patient_id?: string | null;
  created_at: string;
}[]> => {
  try {
    // Ensure user is authenticated before trying to fetch notes
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User must be authenticated to get structured notes');
    }

    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error getting user structured notes:', error);
      throw new Error(`Error getting user structured notes: ${error.message}`);
    }
    
    console.log('All user structured notes:', data);
    
    return data.map(note => ({
      ...note,
      content: note.content as unknown as MedicalSections
    }));
  } catch (error) {
    console.error('Error in getUserStructuredNotes:', error);
    throw error;
  }
};

/**
 * Delete a structured note
 * @param noteId The ID of the note to delete
 * @returns Boolean indicating success
 */
export const deleteStructuredNote = async (noteId: string): Promise<boolean> => {
  try {
    // Ensure user is authenticated before trying to delete the note
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User must be authenticated to delete structured notes');
    }

    const { error } = await supabase
      .from('structured_notes')
      .delete()
      .eq('id', noteId);
      
    if (error) {
      console.error('Error deleting structured note:', error);
      throw new Error(`Error deleting structured note: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteStructuredNote:', error);
    throw error;
  }
};
