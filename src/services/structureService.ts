
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
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw new Error('Invalid or empty text provided');
    }
    
    // Call the edge function to structure the medical text
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
    
    if (!data) {
      throw new Error('No data returned from structuring service');
    }
    
    console.log('Raw response from structure-medical-text:', data);
    
    // If the response is already a MedicalSections object
    if (data && typeof data === 'object' && data.chiefComplaint !== undefined) {
      return data as MedicalSections;
    }
    
    // If the response is in the content field
    if (data && data.content) {
      try {
        // Try to parse the content as JSON if it's a string
        if (typeof data.content === 'string') {
          return JSON.parse(data.content) as MedicalSections;
        } else {
          // If it's already an object, just return it
          return data.content as unknown as MedicalSections;
        }
      } catch (e) {
        console.error('Error parsing structured content:', e);
        // Fallback structure if it's not parseable JSON
        return createFallbackStructure(typeof data.content === 'string' ? data.content : 'Error parsing content');
      }
    }
    
    console.error('Unexpected response format:', data);
    return createFallbackStructure('Structured data not available');
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
