
import { supabase } from '@/integrations/supabase/client';

/**
 * Structures a transcription into medical format using GPT
 * @param transcription The raw transcription text
 * @param userRole The role of the user (doctor, nurse, therapist)
 * @param customTemplate Optional custom template for structuring
 * @returns The structured text in medical documentation format
 */
export const structureText = async (
  transcription: string, 
  userRole: string = 'Doctor',
  customTemplate?: { sections: string[] }
): Promise<any> => {
  try {
    // Call the OpenAI Structure Text function to structure the text
    const { data, error } = await supabase.functions.invoke('openai-structure-text', {
      body: { 
        text: transcription,
        role: userRole,
        template: customTemplate
      },
    });
    
    if (error) {
      console.error('Error structuring text:', error);
      throw new Error(`Error in text structuring: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No structured text returned');
    }
    
    return data;
  } catch (error: any) {
    console.error('Text structuring error:', error);
    throw new Error(`Text structuring failed: ${error.message}`);
  }
};
