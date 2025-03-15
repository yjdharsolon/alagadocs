
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
