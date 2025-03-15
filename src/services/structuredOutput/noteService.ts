
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Get a structured note by ID
 * @param noteId The ID of the structured note to retrieve
 * @returns The structured note
 */
export const getStructuredNoteById = async (noteId: string): Promise<{ 
  id: string;
  content: MedicalSections;
  transcription_id: string;
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
 * Save a structured note to the database
 * @param structuredNote The structured note to save
 * @param transcriptionId The ID of the transcription the note is based on
 * @returns The saved structured note
 */
export const saveStructuredNote = async (
  structuredNote: MedicalSections,
  transcriptionId: string
): Promise<{ id: string }> => {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User must be authenticated to save structured notes');
    }
    
    // Convert MedicalSections to a valid JSON object that Supabase can store
    const content = structuredNote as unknown as Json;
    
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        content,
        transcription_id: transcriptionId,
        user_id: sessionData.session.user.id
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error saving structured note:', error);
      throw new Error(`Error saving structured note: ${error.message}`);
    }
    
    return { id: data.id };
  } catch (error) {
    console.error('Error in saveStructuredNote:', error);
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
