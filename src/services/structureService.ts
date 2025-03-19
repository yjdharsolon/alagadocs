
import { supabase } from '@/integrations/supabase/client';
import { MedicalSections } from '@/components/structured-output/types';
import { getUserProfile } from './userService';

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

/**
 * Enhances prescription data with patient and user information
 */
async function enhancePrescriptionData(structuredData: any, patientId?: string): Promise<any> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Default patient info if we can't find actual patient data
  let patientInfo = {
    name: "Not specified",
    sex: "Not specified",
    age: "Not specified",
    date: currentDate
  };
  
  // Try to get patient data if ID is provided
  if (patientId) {
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('first_name, last_name, gender, age, date_of_birth')
        .eq('id', patientId)
        .maybeSingle();
        
      if (patient) {
        patientInfo = {
          name: `${patient.first_name} ${patient.last_name}`,
          sex: patient.gender || "Not specified",
          age: patient.age ? patient.age.toString() : "Not specified",
          date: currentDate
        };
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  } else {
    // Try to get patient from session storage as fallback
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patient = JSON.parse(storedPatient);
        patientInfo = {
          name: `${patient.first_name} ${patient.last_name}`,
          sex: patient.gender || "Not specified",
          age: patient.age ? patient.age.toString() : "Not specified",
          date: currentDate
        };
      }
    } catch (error) {
      console.error('Error getting patient from session storage:', error);
    }
  }
  
  // Get current user data for prescriber information with proper formatting
  let prescriberInfo = {
    name: "Attending Physician",
    licenseNumber: "License number not specified"
  };
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userData = await getUserProfile(session.user.id);
      if (userData) {
        // Format name properly with middle initial if available
        const firstName = userData.first_name || '';
        const middleName = userData.middle_name ? userData.middle_name.charAt(0) + '. ' : '';
        const lastName = userData.last_name || '';
        const nameExtension = userData.name_extension ? `, ${userData.name_extension}` : '';
        
        prescriberInfo = {
          name: `${firstName} ${middleName}${lastName}${nameExtension}`.trim() || "Attending Physician",
          licenseNumber: userData.prc_license || "License number not specified",
          // title, s2Number and ptrNumber fields included if available
          title: userData.medical_title || "",
          s2Number: userData.s2_number || "",
          ptrNumber: userData.ptr_number || ""
        };
      }
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }
  
  // Merge the data
  return {
    ...structuredData,
    patientInformation: patientInfo,
    prescriberInformation: prescriberInfo
  };
}

/**
 * Normalize structured data to ensure consistent formats across all note types
 */
const normalizeStructuredData = (data: any, role: string): MedicalSections => {
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
