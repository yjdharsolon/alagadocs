
import { supabase } from '@/integrations/supabase/client';

/**
 * Saves a structured note to the user's account
 * @param userId The ID of the user
 * @param title The title of the note
 * @param content The content of the note (structured text as string)
 * @returns The ID of the saved note
 */
export const saveStructuredNote = async (
  userId: string,
  title: string,
  content: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId, 
        title, 
        content
      })
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
