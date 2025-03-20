
import { MedicalSections } from '@/components/structured-output/types';
import { detectFormat } from './formatDetector';
import { 
  normalizeSOAPFormat, 
  normalizeConsultationFormat, 
  normalizePrescriptionFormat, 
  normalizeStandardFormat 
} from './formatNormalizers';
import { getEmptyStructure } from './emptyStructures';

/**
 * Normalizes structured data to ensure consistent formats across all note types.
 * This function takes raw structured data and converts it to a standardized format
 * based on the document type (standard medical history, SOAP note, consultation, or prescription).
 * 
 * @param data - The raw structured data from the AI service or database
 * @param role - The medical professional role or document format type
 * @returns A normalized MedicalSections object with consistent structure
 */
export const normalizeStructuredData = (data: any, role: string): MedicalSections => {
  // Debug data received
  console.log('Normalizing data with keys:', Object.keys(data));
  console.log('Role parameter:', role);
  
  // Check if data is essentially empty
  const isEmpty = !data || Object.keys(data).length === 0 || Object.values(data).every(val => 
    val === "" || val === undefined || val === null ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof val === 'object' && Object.keys(val).length === 0)
  );
  
  if (isEmpty) {
    console.log('Data is empty, returning appropriate empty format');
    return getEmptyStructure(role);
  }
  
  // Preserve medications array if it exists and is an array
  // This ensures we don't lose medication data during normalization
  const hasMedicationArray = data.medications && Array.isArray(data.medications);
  console.log('Has medication array:', hasMedicationArray, 
    hasMedicationArray ? `with ${data.medications.length} items` : '');
  
  // Detect format
  const format = detectFormat(data, role);
  console.log('Detected format for normalization:', format);
  
  // Normalize based on format
  switch (format) {
    case 'soap':
      return normalizeSOAPFormat(data);
    case 'consultation':
      return normalizeConsultationFormat(data);
    case 'prescription':
      return normalizePrescriptionFormat(data);
    default:
      return normalizeStandardFormat(data);
  }
};
