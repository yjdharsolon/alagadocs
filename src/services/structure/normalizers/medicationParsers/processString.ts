
import { parseComplexMedicationString } from './parseComplexString';

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
