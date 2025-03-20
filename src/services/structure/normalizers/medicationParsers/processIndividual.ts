
import { parseComplexMedicationString } from './parseComplexString';
import { ensureString } from './stringUtils';
import { processStringMedication } from './processString';

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
