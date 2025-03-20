
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { enhancePrescriptionData } from './prescriptionEnhancer';
import { normalizeStructuredData } from './normalizers/dataNormalizer';

/**
 * Structures transcribed text into medical note sections
 * @param text The transcribed text to structure
 * @param role The medical professional role (e.g., Doctor, Nurse)
 * @param template Optional custom template with sections
 * @param patientId Optional patient ID to include patient information
 * @returns The structured medical note sections
 */
export const structureText = async (
  text: string, 
  role: string = 'Doctor',
  template?: { sections: string[] },
  patientId?: string
): Promise<MedicalSections> => {
  try {
    console.log('Structuring text with role:', role);
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw new Error('Invalid or empty text provided');
    }
    
    // Fix role mapping for History & Physical format
    // If the role parameter is one of the format names, map it appropriately
    let formattedRole = role;
    let formattedTemplate = template;
    
    // Map roles to their proper format types
    if (role === 'history') {
      console.log('Converting "history" role to standard History & Physical format');
      formattedTemplate = { 
        sections: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Physical Examination', 'Assessment', 'Plan'] 
      };
    } else if (role === 'soap') {
      formattedTemplate = { sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] };
    } else if (role === 'consultation') {
      formattedTemplate = { sections: ['Reason for Consultation', 'History', 'Findings', 'Impression', 'Recommendations'] };
    } else if (role === 'prescription') {
      formattedTemplate = { sections: ['Prescription'] };
    }
    
    console.log('Using formatted template:', formattedTemplate);
    
    // Call the edge function to structure the medical text
    const { data, error } = await supabase.functions.invoke('structure-medical-transcript', {
      body: { 
        text,
        role: formattedRole,
        template: formattedTemplate
      }
    });
    
    if (error) {
      console.error('Error structuring text:', error);
      throw new Error(`Error structuring text: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from structuring service');
    }
    
    console.log('Raw response from structure-medical-transcript:', data);
    
    // Parse the response
    let structuredData;
    if (typeof data === 'string') {
      try {
        structuredData = JSON.parse(data);
      } catch (e) {
        structuredData = data;
      }
    } else {
      structuredData = data;
    }
    
    // For prescriptions, enhance with patient and user data
    if (formattedTemplate?.sections?.includes('Prescription')) {
      structuredData = await enhancePrescriptionData(structuredData, patientId);
    }
    
    // Normalize and return the structured data
    const normalizedData = normalizeStructuredData(structuredData, role);
    console.log('Normalized data:', normalizedData);
    return normalizedData;
  } catch (error) {
    console.error('Error in structureText:', error);
    throw error;
  }
};
