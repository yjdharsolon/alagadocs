
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
 * Saves a structured note to the database
 * @param note The structured note to save
 * @param userId The user ID to associate with the note
 * @param audioUrl Optional URL to the source audio file
 * @returns The ID of the saved note
 */
export const saveStructuredNote = async (
  note: MedicalSections,
  userId: string,
  audioUrl?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('structured_notes')
      .insert({
        user_id: userId,
        audio_url: audioUrl,
        chief_complaint: note.chiefComplaint,
        history_of_present_illness: note.historyOfPresentIllness,
        past_medical_history: note.pastMedicalHistory,
        medications: note.medications,
        allergies: note.allergies,
        physical_examination: note.physicalExamination,
        assessment: note.assessment,
        plan: note.plan
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error saving structured note:', error);
      throw new Error(`Error saving note: ${error.message}`);
    }
    
    return data.id;
  } catch (error) {
    console.error('Error in saveStructuredNote:', error);
    throw error;
  }
};

/**
 * Retrieves a structured note from the database
 * @param noteId The ID of the note to retrieve
 * @returns The structured note
 */
export const getStructuredNote = async (noteId: string): Promise<{
  note: MedicalSections;
  audioUrl?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('id', noteId)
      .single();
      
    if (error) {
      console.error('Error fetching structured note:', error);
      throw new Error(`Error fetching note: ${error.message}`);
    }
    
    // Map database fields to MedicalSections interface
    const note: MedicalSections = {
      chiefComplaint: data.chief_complaint,
      historyOfPresentIllness: data.history_of_present_illness,
      pastMedicalHistory: data.past_medical_history,
      medications: data.medications,
      allergies: data.allergies,
      physicalExamination: data.physical_examination,
      assessment: data.assessment,
      plan: data.plan
    };
    
    return {
      note,
      audioUrl: data.audio_url
    };
  } catch (error) {
    console.error('Error in getStructuredNote:', error);
    throw error;
  }
};
