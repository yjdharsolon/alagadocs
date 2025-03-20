
import { processStringMedication, processIndividualMedication } from './medicationProcessors';

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
        return parsed.map(processIndividualMedication);
      }
      // Check if it's a medication string, like "Aspirin (aspilets) 80mg"
      if (typeof parsed === 'string' && (parsed.includes('(') || !parsed.startsWith('{'))) {
        return [processStringMedication(parsed)];
      }
      
      // If parsed but not an array, wrap in array
      return [processIndividualMedication(parsed)];
    } catch (e) {
      // Check if it's a medication string that needs parsing
      if (arr.includes('(')) {
        return [processStringMedication(arr)];
      }
      
      // If can't parse, return as a single medication with name set to the string
      return [{ genericName: arr, brandName: '', strength: '', dosageForm: '', sigInstructions: '', quantity: '', refills: '', specialInstructions: '' }];
    }
  }
  
  // If already an array, normalize each item
  if (Array.isArray(arr)) {
    return arr.map(processIndividualMedication);
  }
  
  // If it's an object but not an array, wrap in array
  if (typeof arr === 'object') {
    return [processIndividualMedication(arr)];
  }
  
  // Default to empty array
  return [];
};
