
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections, StructuredNote } from '@/components/structured-output/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Structure a transcription using the OpenAI API
 * @param text The transcription text to structure
 * @param role The healthcare professional role (Doctor, Nurse, etc.)
 * @param template Optional template with custom sections
 * @param transcriptionId Optional ID of the transcription to associate with the structured note
 * @returns The structured medical note
 */
export const structureTranscription = async (
  text: string,
  role: string = 'Doctor',
  template?: { sections: string[] },
  transcriptionId?: string
): Promise<MedicalSections> => {
  try {
    const { data, error } = await supabase.functions.invoke('structure-medical-transcript', {
      body: { 
        text, 
        role, 
        template,
        transcriptionId
      }
    });
    
    if (error) {
      console.error('Error structuring transcription:', error);
      throw new Error(`Error structuring transcription: ${error.message}`);
    }
    
    return data as MedicalSections;
  } catch (error) {
    console.error('Error in structureTranscription:', error);
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
  created_at: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('id', noteId)
      .single();
      
    if (error) {
      console.error('Error getting structured note:', error);
      throw new Error(`Error getting structured note: ${error.message}`);
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
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to save structured notes');
    }
    
    // Convert MedicalSections to a valid JSON object that Supabase can store
    const content = structuredNote as unknown as Json;
    
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        content,
        transcription_id: transcriptionId,
        user_id: user.id
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
