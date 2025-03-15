
import { supabase } from '@/integrations/supabase/client';

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
