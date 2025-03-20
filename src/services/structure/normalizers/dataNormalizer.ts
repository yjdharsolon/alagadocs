
import { MedicalSections } from '@/components/structured-output/types';
import { ensureString, normalizeObject, normalizeArray } from './typeNormalizers';

/**
 * Normalize structured data to ensure consistent formats across all note types
 */
export const normalizeStructuredData = (data: any, role: string): MedicalSections => {
  // Determine the format based on keys or role
  let format = 'standard';
  
  // Debug data received
  console.log('Normalizing data with keys:', Object.keys(data));
  console.log('Role parameter:', role);
  
  // Improve format detection logic
  if (data.subjective !== undefined && data.objective !== undefined) {
    format = 'soap';
  } else if (data.reasonForConsultation !== undefined) {
    format = 'consultation';
  } else if (data.patientInformation !== undefined || 
            (Array.isArray(data.medications) && typeof data.medications[0] === 'object')) {
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
      return {
        patientInformation: normalizeObject(data.patientInformation, {
          name: '',
          sex: '',
          age: '',
          date: '',
        }),
        medications: normalizeArray(data.medications),
        prescriberInformation: normalizeObject(data.prescriberInformation, {
          name: '',
          licenseNumber: '',
          s2Number: '',
          ptrNumber: '',
          title: ''
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
