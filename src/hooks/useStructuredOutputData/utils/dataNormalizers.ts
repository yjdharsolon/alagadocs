
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Normalizes medication data to ensure consistent structure
 */
export const normalizeMedicationData = (medications: any[]): any[] => {
  if (!medications || !Array.isArray(medications)) return [];
  
  console.log('[dataNormalizers] Normalizing medication data:', JSON.stringify(medications, null, 2));
  
  return medications.map((med, index) => {
    if (typeof med === 'string') {
      return {
        id: index + 1,
        genericName: med,
        brandName: '',
        strength: '',
        dosageForm: '',
        sigInstructions: '',
        quantity: '',
        refills: '',
        specialInstructions: ''
      };
    }
    
    return {
      id: med.id || index + 1,
      genericName: med.genericName || med.name || '',
      brandName: med.brandName || '',
      strength: med.strength || '',
      dosageForm: med.dosageForm || '',
      sigInstructions: med.sigInstructions || '',
      quantity: med.quantity || '',
      refills: med.refills || '',
      specialInstructions: med.specialInstructions || ''
    };
  });
};
