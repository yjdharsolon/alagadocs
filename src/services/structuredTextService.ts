
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Structures transcribed text into medical note sections
 * @param text The transcribed text to structure
 * @param role The medical professional role (e.g., Doctor, Nurse)
 * @param template Optional custom template with sections
 * @returns The structured medical note sections
 */
export const structureText = async (
  text: string, 
  role: string = 'Doctor',
  template?: { sections: string[] }
): Promise<MedicalSections> => {
  try {
    console.log('Structuring text with role:', role);
    
    const { data, error } = await supabase.functions.invoke('structure-medical-text', {
      body: { 
        text,
        role,
        template
      }
    });
    
    if (error) {
      console.error('Error structuring text:', error);
      throw new Error(`Error structuring text: ${error.message}`);
    }
    
    // If the response is already a MedicalSections object
    if (data.chiefComplaint !== undefined) {
      return data as MedicalSections;
    }
    
    // If the response is in the content field
    if (data.content) {
      try {
        // Try to parse the content as JSON
        return JSON.parse(data.content) as MedicalSections;
      } catch (e) {
        // Fallback structure if it's not parseable JSON
        return createFallbackStructure(data.content);
      }
    }
    
    return data as MedicalSections;
  } catch (error) {
    console.error('Error in structureText:', error);
    throw error;
  }
};

/**
 * Creates a fallback structure when the response cannot be parsed
 * @param text The raw text to include
 * @returns A basic medical sections object with the text in assessment
 */
const createFallbackStructure = (text: string): MedicalSections => {
  return {
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: text, // Place all text in assessment
    plan: ''
  };
};

/**
 * Saves structured text to the database
 * @param userId The user ID associated with the note
 * @param transcriptionId The ID of the source transcription
 * @param content The structured note content
 * @returns The saved note data
 */
export const saveStructuredNote = async (
  userId: string,
  transcriptionId: string,
  content: MedicalSections
): Promise<any> => {
  try {
    // Insert into structured_notes table with correct fields
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        user_id: userId,
        transcription_id: transcriptionId,
        content: content // Store the entire MedicalSections object as JSON in the content field
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error saving structured note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
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
    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('transcription_id', transcriptionId)
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
