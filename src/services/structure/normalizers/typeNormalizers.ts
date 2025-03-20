
import { processStringMedication, processIndividualMedication } from './medicationProcessors';

/**
 * Ensures a value is a string.
 * Converts undefined, null, objects, and other non-string values to string representation.
 * 
 * @param value - The value to convert to a string
 * @returns A string representation of the value, or empty string if undefined/null
 */
export const ensureString = (value: any): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Normalizes an object to ensure it has the expected properties.
 * Uses a template object to define the expected structure.
 * 
 * @param obj - The source object to normalize
 * @param template - A template object that defines the expected structure
 * @returns A normalized object with all properties from the template
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
 * Normalizes an array of medication objects or medication strings.
 * Handles various input formats including:
 * - JSON strings
 * - Arrays of objects
 * - Arrays of strings
 * - Single medication objects
 * - Single medication strings
 * 
 * @param arr - The source medication data to normalize 
 * @returns An array of normalized medication objects
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
