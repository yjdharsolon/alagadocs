
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
    
    // Set template sections based on the role if not provided
    if (!template) {
      switch (role) {
        case 'soap':
          template = { sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] };
          break;
        case 'history':
          template = { sections: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Physical Examination', 'Assessment', 'Plan'] };
          break;
        case 'consultation':
          template = { sections: ['Reason for Consultation', 'History', 'Findings', 'Impression', 'Recommendations'] };
          break;
        case 'prescription':
          template = { sections: ['Patient Information', 'Medications', 'Prescriber Information'] };
          break;
      }
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
    if (data && typeof data === 'object') {
      return normalizeStructuredData(data, role);
    }
    
    // If the response is in the content field
    if (data && data.content) {
      try {
        // Try to parse the content as JSON if it's a string
        if (typeof data.content === 'string') {
          const parsedContent = JSON.parse(data.content);
          return normalizeStructuredData(parsedContent, role);
        } else {
          // If it's already an object, normalize it
          return normalizeStructuredData(data.content, role);
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
 * Normalize structured data to ensure consistent formats across all note types
 */
const normalizeStructuredData = (data: any, role: string): MedicalSections => {
  // Determine the format based on keys or role
  let format = 'standard';
  
  if (data.subjective !== undefined && data.objective !== undefined) {
    format = 'soap';
  } else if (data.reasonForConsultation !== undefined) {
    format = 'consultation';
  } else if (data.patientInformation !== undefined || data.medications !== undefined) {
    format = 'prescription';
  } else if (role === 'soap') {
    format = 'soap';
  } else if (role === 'consultation') {
    format = 'consultation';
  } else if (role === 'prescription') {
    format = 'prescription';
  }
  
  // Normalize based on format
  switch (format) {
    case 'soap':
      return {
        subjective: ensureString(data.subjective),
        objective: ensureString(data.objective),
        assessment: ensureString(data.assessment),
        plan: ensureString(data.plan)
      };
    case 'consultation':
      return {
        reasonForConsultation: ensureString(data.reasonForConsultation),
        history: ensureString(data.history),
        findings: ensureString(data.findings),
        impression: ensureString(data.impression),
        recommendations: ensureString(data.recommendations)
      };
    case 'prescription':
      return {
        patientInformation: normalizeObject(data.patientInformation, {
          name: '',
          sex: '',
          age: '',
          date: '',
        }),
        medications: normalizeArray(data.medications),
        prescriberInformation: normalizeObject(data.prescriberInformation, {
          name: '',
          licenseNumber: '',
          signature: '[SIGNATURE]',
        })
      };
    default:
      // Standard history & physical format
      return {
        chiefComplaint: ensureString(data.chiefComplaint),
        historyOfPresentIllness: ensureString(data.historyOfPresentIllness),
        pastMedicalHistory: ensureString(data.pastMedicalHistory),
        medications: ensureString(data.medications),
        allergies: ensureString(data.allergies),
        physicalExamination: ensureString(data.physicalExamination),
        assessment: ensureString(data.assessment),
        plan: ensureString(data.plan)
      };
  }
};

/**
 * Ensures a value is a string
 */
const ensureString = (value: any): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Normalizes an object to ensure it has the expected properties
 */
const normalizeObject = (obj: any, template: any): any => {
  if (!obj || typeof obj !== 'object') {
    return template;
  }
  
  const result: any = {};
  for (const key in template) {
    result[key] = ensureString(obj[key] || template[key]);
  }
  
  return result;
};

/**
 * Normalizes an array of medication objects
 */
const normalizeArray = (arr: any): any[] => {
  if (!arr) return [];
  
  // If it's a string, try to parse it as JSON
  if (typeof arr === 'string') {
    try {
      const parsed = JSON.parse(arr);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If parsed but not an array, wrap in array
      return [parsed];
    } catch (e) {
      // If can't parse, return as a single medication with name set to the string
      return [{ name: arr, strength: '', dosageForm: '', sigInstructions: '', quantity: '', refills: '', specialInstructions: '' }];
    }
  }
  
  // If already an array, normalize each item
  if (Array.isArray(arr)) {
    return arr.map(item => {
      if (typeof item === 'string') {
        return { name: item, strength: '', dosageForm: '', sigInstructions: '', quantity: '', refills: '', specialInstructions: '' };
      }
      return {
        name: ensureString(item.name || ''),
        strength: ensureString(item.strength || ''),
        dosageForm: ensureString(item.dosageForm || ''),
        sigInstructions: ensureString(item.sigInstructions || ''),
        quantity: ensureString(item.quantity || ''),
        refills: ensureString(item.refills || ''),
        specialInstructions: ensureString(item.specialInstructions || '')
      };
    });
  }
  
  // If it's an object but not an array, wrap in array
  if (typeof arr === 'object') {
    return [{
      name: ensureString(arr.name || ''),
      strength: ensureString(arr.strength || ''),
      dosageForm: ensureString(arr.dosageForm || ''),
      sigInstructions: ensureString(arr.sigInstructions || ''),
      quantity: ensureString(arr.quantity || ''),
      refills: ensureString(arr.refills || ''),
      specialInstructions: ensureString(arr.specialInstructions || '')
    }];
  }
  
  // Default to empty array
  return [];
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
