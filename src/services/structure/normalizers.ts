
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Normalize structured data to ensure consistent formats across all note types
 */
export const normalizeStructuredData = (data: any, role: string): MedicalSections => {
  // Determine the format based on keys or role
  let format = 'standard';
  
  // Debug data received
  console.log('Normalizing data with keys:', Object.keys(data));
  console.log('Role parameter:', role);
  
  // Improve format detection logic
  if (data.subjective !== undefined && data.objective !== undefined) {
    format = 'soap';
  } else if (data.reasonForConsultation !== undefined) {
    format = 'consultation';
  } else if (data.patientInformation !== undefined || 
            (Array.isArray(data.medications) && typeof data.medications[0] === 'object')) {
    format = 'prescription';
  } else if (role === 'soap') {
    format = 'soap';
  } else if (role === 'consultation') {
    format = 'consultation';
  } else if (role === 'prescription') {
    format = 'prescription';
  } else if (role === 'history' || 
            (data.chiefComplaint !== undefined || 
             data.historyOfPresentIllness !== undefined)) {
    format = 'standard';
  }
  
  console.log('Detected format for normalization:', format);
  
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
          s2Number: '',
          ptrNumber: '',
          title: ''
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
export const ensureString = (value: any): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Normalizes an object to ensure it has the expected properties
 */
export const normalizeObject = (obj: any, template: any): any => {
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
export const normalizeArray = (arr: any): any[] => {
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
export const createFallbackStructure = (text: string): MedicalSections => {
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
