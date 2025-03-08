
import { supabase } from '@/integrations/supabase/client';

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
