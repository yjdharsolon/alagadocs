
import { processStringMedication, processIndividualMedication } from './medicationParsers';

/**
 * Processes a string medication format like "Aspirin (aspilets) 80mg".
 * Parses the string to extract generic name, brand name, and strength information.
 * 
 * @param medicationString - A medication string to process (e.g., "Aspirin (aspilets) 80mg")
 * @returns A medication object with parsed components and empty fields for other properties
 */
export const processStringMedication = (medicationString: string) => {
  const { genericName, brandName, strength } = parseComplexMedicationString(medicationString);
  console.log(`Processed string medication: "${medicationString}" -> Generic: "${genericName}", Brand: "${brandName}", Strength: "${strength}"`);
  
  return { 
    genericName, 
    brandName,
    strength, 
    dosageForm: '', 
    sigInstructions: '', 
    quantity: '', 
    refills: '', 
    specialInstructions: '' 
  };
};

/**
 * Processes an individual medication object or string into a standardized format.
 * Handles multiple input formats:
 * - String medications (e.g., "Aspirin (aspilets) 80mg")
 * - Simple string medication names (e.g., "Metformin")
 * - Object with genericName/name containing combined name format (e.g., {genericName: "Aspirin (aspilets)"})
 * - Complete medication objects with all properties
 * 
 * @param item - A medication object or string to process
 * @returns A normalized medication object with standardized properties
 */
export const processIndividualMedication = (item: any) => {
  if (typeof item === 'string') {
    // Parse medication strings in "GenericName (BrandName) Strength" format
    if (item.includes('(')) {
      return processStringMedication(item);
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
  let genericNameValue = item.genericName || item.name || '';
  let brandNameValue = item.brandName || '';
  let strengthValue = item.strength || '';
  
  // If genericName contains a format like "Generic (Brand)", parse it
  if (genericNameValue && genericNameValue.includes('(') && genericNameValue.includes(')') && !brandNameValue) {
    const { genericName, brandName, strength } = parseComplexMedicationString(genericNameValue);
    genericNameValue = genericName;
    brandNameValue = brandName;
    // Only use parsed strength if the original strength is empty
    if (!strengthValue && strength) {
      strengthValue = strength;
    }
  }
  
  return {
    genericName: genericNameValue,
    brandName: brandNameValue,
    strength: ensureString(strengthValue),
    dosageForm: ensureString(item.dosageForm || ''),
    sigInstructions: ensureString(item.sigInstructions || ''),
    quantity: ensureString(item.quantity || ''),
    refills: ensureString(item.refills || ''),
    specialInstructions: ensureString(item.specialInstructions || '')
  };
};

/**
 * Parses a complex medication string that may contain generic name, brand name, and strength.
 * Examples: "Aspirin (aspilets) 80mg", "Metformin 500mg"
 * 
 * @param medicationString - The medication string to parse
 * @returns An object with genericName, brandName, and strength properties
 */
export const parseComplexMedicationString = (medicationString: string) => {
  let genericName = medicationString;
  let brandName = '';
  let strength = '';
  
  // Extract brand name in parentheses if present
  if (medicationString.includes('(') && medicationString.includes(')')) {
    const startBrand = medicationString.indexOf('(');
    const endBrand = medicationString.indexOf(')', startBrand);
    
    if (startBrand > 0 && endBrand > startBrand) {
      genericName = medicationString.substring(0, startBrand).trim();
      brandName = medicationString.substring(startBrand + 1, endBrand).trim();
      
      // If there's text after the closing parenthesis, it may be the strength
      if (endBrand + 1 < medicationString.length) {
        strength = medicationString.substring(endBrand + 1).trim();
      }
    }
  } else {
    // No brand name, check for strength at the end
    const parts = medicationString.split(' ');
    if (parts.length > 1 && /\d/.test(parts[parts.length - 1])) {
      strength = parts[parts.length - 1];
      genericName = parts.slice(0, parts.length - 1).join(' ');
    }
  }
  
  return { genericName, brandName, strength };
};

// Importing ensureString to avoid circular dependency
const ensureString = (value: any): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};
