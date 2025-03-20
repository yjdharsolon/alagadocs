
/**
 * This file is now a compatibility layer for the new medicationProcessors.ts file.
 * It re-exports the functionality from medicationProcessors.ts to avoid breaking
 * existing code that imports from this file.
 */
import {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
} from './medicationProcessors';

export {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
};
