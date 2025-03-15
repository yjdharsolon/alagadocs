
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { Json } from '@/integrations/supabase/types';
import { ensureUuid } from '@/utils/uuidUtils';

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
