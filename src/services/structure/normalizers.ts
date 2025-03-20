
import { MedicalSections } from '@/components/structured-output/types';
import { parseMedicationName } from '@/components/structured-output/tabs/prescription/formatUtils';

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
      // Check if it's a medication string, like "Aspirin (aspilets) 80mg"
      if (typeof parsed === 'string' && (parsed.includes('(') || !parsed.startsWith('{'))) {
        const { genericName, brandName } = parseMedicationName(parsed);
        return [{ 
          genericName, 
          brandName, 
          strength: '', 
          dosageForm: '', 
          sigInstructions: '', 
          quantity: '', 
          refills: '', 
          specialInstructions: '' 
        }];
      }
      
      // If parsed but not an array, wrap in array
      return [parsed];
    } catch (e) {
      // Check if it's a medication string that needs parsing
      if (arr.includes('(')) {
        const { genericName, brandName } = parseMedicationName(arr);
        console.log(`Parsed medication string: "${arr}" -> Generic: "${genericName}", Brand: "${brandName}"`);
        return [{ 
          genericName, 
          brandName,
          strength: '', 
          dosageForm: '', 
          sigInstructions: '', 
          quantity: '', 
          refills: '', 
          specialInstructions: '' 
        }];
      }
      
      // If can't parse, return as a single medication with name set to the string
      return [{ genericName: arr, brandName: '', strength: '', dosageForm: '', sigInstructions: '', quantity: '', refills: '', specialInstructions: '' }];
    }
  }
  
  // If already an array, normalize each item
  if (Array.isArray(arr)) {
    return arr.map(item => {
      if (typeof item === 'string') {
        // Parse medication strings in "GenericName (BrandName) Strength" format
        if (item.includes('(')) {
          const { genericName, brandName } = parseMedicationName(item);
          return { 
            genericName, 
            brandName, 
            strength: '', 
            dosageForm: '', 
            sigInstructions: '', 
            quantity: '', 
            refills: '', 
            specialInstructions: '' 
          };
        }
        return { 
          genericName: item, 
          brandName: '', 
          strength: '', 
          dosageForm: '', 
          sigInstructions: '', 
          quantity: '', 
          refills: '', 
          specialInstructions: '' 
        };
      }
      
      // Handle objects that might have genericName and name fields
      const genericNameValue = item.genericName || item.name || '';
      let brandNameValue = item.brandName || '';
      
      // If genericName contains a format like "Generic (Brand)", parse it
      if (genericNameValue.includes('(') && genericNameValue.includes(')') && !brandNameValue) {
        const { genericName, brandName } = parseMedicationName(genericNameValue);
        return {
          genericName,
          brandName,
          strength: ensureString(item.strength || ''),
          dosageForm: ensureString(item.dosageForm || ''),
          sigInstructions: ensureString(item.sigInstructions || ''),
          quantity: ensureString(item.quantity || ''),
          refills: ensureString(item.refills || ''),
          specialInstructions: ensureString(item.specialInstructions || '')
        };
      }
      
      return {
        genericName: genericNameValue,
        brandName: brandNameValue,
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
    const genericNameValue = arr.genericName || arr.name || '';
    let brandNameValue = arr.brandName || '';
    
    // If genericName contains "(BrandName)", extract it
    if (genericNameValue.includes('(') && genericNameValue.includes(')') && !brandNameValue) {
      const { genericName, brandName } = parseMedicationName(genericNameValue);
      return [{
        genericName,
        brandName,
        strength: ensureString(arr.strength || ''),
        dosageForm: ensureString(arr.dosageForm || ''),
        sigInstructions: ensureString(arr.sigInstructions || ''),
        quantity: ensureString(arr.quantity || ''),
        refills: ensureString(arr.refills || ''),
        specialInstructions: ensureString(arr.specialInstructions || '')
      }];
    }
    
    return [{
      genericName: genericNameValue,
      brandName: brandNameValue,
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
