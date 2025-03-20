
/**
 * This file is now a compatibility layer that re-exports medication processing functions
 * from the modular medicationParsers directory.
 * 
 * It maintains backward compatibility while providing a more maintainable code structure.
 */
import {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
} from './medicationParsers/index';

export {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
};
