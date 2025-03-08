
import { supabase } from '@/integrations/supabase/client';

/**
 * Saves a structured note to the database
 * @param userId The user ID who owns the note
 * @param title The title of the note
 * @param content The content of the note (as a string, will be parsed as JSON)
 * @returns The saved note data
 */
export const saveStructuredNote = async (
  userId: string,
  title: string,
  content: string
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title,
        content
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Note saving error:', error);
    throw new Error(`Note saving failed: ${error.message}`);
  }
};

/**
 * Gets all notes for a user
 * @param userId The user ID to get notes for
 * @returns The user's notes
 */
export const getUserNotes = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notes:', error);
      throw new Error(`Error fetching notes: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Notes fetching error:', error);
    throw new Error(`Notes fetching failed: ${error.message}`);
  }
};

/**
 * Deletes a note
 * @param noteId The ID of the note to delete
 * @returns void
 */
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
      
    if (error) {
      console.error('Error deleting note:', error);
      throw new Error(`Error deleting note: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Note deletion error:', error);
    throw new Error(`Note deletion failed: ${error.message}`);
  }
};
