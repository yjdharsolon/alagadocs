
import { MedicalSections } from '@/components/structured-output/types';
import { ensureString, normalizeObject, normalizeArray } from './typeNormalizers';

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
  // Determine the format based on keys or role
  let format = 'standard';
  
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
  
  // Improve format detection logic
  if (data.subjective !== undefined && data.objective !== undefined) {
    format = 'soap';
  } else if (data.reasonForConsultation !== undefined) {
    format = 'consultation';
  } else if (data.patientInformation !== undefined || 
            (hasMedicationArray && typeof data.medications[0] === 'object')) {
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
  
  // CRITICAL: Special handling for prescription data - ALWAYS preserve medication arrays exactly as they are
  if (format === 'prescription' && hasMedicationArray) {
    console.log('Special handling for prescription medications array - preserving original array');
    
    // Create a deep clone of the medication array to avoid reference issues
    const medicationsClone = JSON.parse(JSON.stringify(data.medications));
    
    // Ensure each medication has all required properties to prevent data loss
    const processedMedications = medicationsClone.map((med: any, index: number) => {
      return {
        id: med.id || index + 1,
        genericName: med.genericName || med.name || '',
        brandName: med.brandName !== undefined ? med.brandName : '',
        strength: med.strength || '',
        dosageForm: med.dosageForm || '',
        sigInstructions: med.sigInstructions || '',
        quantity: med.quantity || '',
        refills: med.refills || '',
        specialInstructions: med.specialInstructions || ''
      };
    });
    
    console.log('Processed medications:', JSON.stringify(processedMedications, null, 2));
    
    return {
      patientInformation: normalizeObject(data.patientInformation, {
        name: '',
        sex: '',
        age: '',
        date: '',
      }),
      medications: processedMedications, // Use the fully processed array
      prescriberInformation: normalizeObject(data.prescriberInformation, {
        name: '',
        licenseNumber: '',
        s2Number: '',
        ptrNumber: ''
      })
    };
  }
  
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
      // This code path handles prescription without existing medications array
      // or when the medications property isn't an array
      return {
        patientInformation: normalizeObject(data.patientInformation, {
          name: '',
          sex: '',
          age: '',
          date: '',
        }),
        medications: normalizeArray(data.medications).map((med: any, index: number) => {
          // If medications is just a string, convert to object
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
          
          // Ensure all medication objects have consistent structure
          return {
            id: med.id || index + 1,
            genericName: med.genericName || med.name || '',
            brandName: med.brandName !== undefined ? med.brandName : '',
            strength: med.strength || '',
            dosageForm: med.dosageForm || '',
            sigInstructions: med.sigInstructions || '',
            quantity: med.quantity || '',
            refills: med.refills || '',
            specialInstructions: med.specialInstructions || ''
          };
        }),
        prescriberInformation: normalizeObject(data.prescriberInformation, {
          name: '',
          licenseNumber: '',
          s2Number: '',
          ptrNumber: ''
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
 * Returns an appropriate empty structure based on format
 */
function getEmptyStructure(role: string): MedicalSections {
  switch (role) {
    case 'soap':
      return {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
      };
    case 'consultation':
      return {
        reasonForConsultation: '',
        history: '',
        findings: '',
        impression: '',
        recommendations: ''
      };
    case 'prescription':
      return {
        patientInformation: {
          name: '',
          sex: '',
          age: '',
          date: '',
        },
        medications: [],
        prescriberInformation: {
          name: '',
          licenseNumber: '',
          s2Number: '',
          ptrNumber: ''
        }
      };
    default:
      return {
        chiefComplaint: '',
        historyOfPresentIllness: '',
        pastMedicalHistory: '',
        medications: '',
        allergies: '',
        physicalExamination: '',
        assessment: '',
        plan: ''
      };
  }
}
