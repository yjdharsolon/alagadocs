
import { MedicalSections } from '@/components/structured-output/types';
import { ensureString, normalizeObject, normalizeArray } from './typeNormalizers';

/**
 * Normalizes SOAP format data
 */
export function normalizeSOAPFormat(data: any): MedicalSections {
  return {
    subjective: ensureString(data.subjective),
    objective: ensureString(data.objective),
    assessment: ensureString(data.assessment),
    plan: ensureString(data.plan)
  };
}

/**
 * Normalizes consultation format data
 */
export function normalizeConsultationFormat(data: any): MedicalSections {
  return {
    reasonForConsultation: ensureString(data.reasonForConsultation),
    history: ensureString(data.history),
    findings: ensureString(data.findings),
    impression: ensureString(data.impression),
    recommendations: ensureString(data.recommendations)
  };
}

/**
 * Normalizes prescription format data
 * Handles cases with and without existing medication arrays
 */
export function normalizePrescriptionFormat(data: any): MedicalSections {
  // Handle case with prescription that has medications array
  const hasMedicationArray = data.medications && Array.isArray(data.medications);
  
  if (hasMedicationArray) {
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
    
    return {
      patientInformation: normalizeObject(data.patientInformation, {
        name: '',
        sex: '',
        age: '',
        date: '',
      }),
      medications: processedMedications,
      prescriberInformation: normalizeObject(data.prescriberInformation, {
        name: '',
        licenseNumber: '',
        s2Number: '',
        ptrNumber: ''
      })
    };
  }
  
  // Handle prescription without existing medications array or when medications is not an array
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
}

/**
 * Normalizes standard medical history format data
 */
export function normalizeStandardFormat(data: any): MedicalSections {
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
