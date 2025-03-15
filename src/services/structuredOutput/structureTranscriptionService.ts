
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';

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
    // Get current user session to include the token in the request
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error('User must be authenticated to structure transcriptions');
    }

    const { data, error } = await supabase.functions.invoke('structure-medical-transcript', {
      body: { 
        text, 
        role, 
        template,
        transcriptionId
      },
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
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
