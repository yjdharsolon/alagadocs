
/**
 * This file is now a compatibility layer for the new medicationParsers directory.
 * It re-exports the functionality from the new modular structure to avoid breaking
 * existing code that imports from this file.
 */
import {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString,
  ensureString
} from './medicationParsers/index';

export {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString,
  ensureString
};
