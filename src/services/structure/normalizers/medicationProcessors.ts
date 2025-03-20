
import { parseComplexMedicationString } from './medicationParsers';
import { ensureString } from './typeNormalizers';

/**
 * Process a string medication format like "Aspirin (aspilets) 80mg"
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
 * Process an individual medication object or string
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
