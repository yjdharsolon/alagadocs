
import { normalizeStructuredData } from './dataNormalizer';
import { ensureString, normalizeObject, normalizeArray } from './typeNormalizers';
import { createFallbackStructure } from './fallbackCreator';
import { detectFormat } from './formatDetector';
import { getEmptyStructure } from './emptyStructures';
import { 
  normalizeSOAPFormat, 
  normalizeConsultationFormat, 
  normalizePrescriptionFormat, 
  normalizeStandardFormat 
} from './formatNormalizers';
import {
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
} from './medicationParsers';

/**
 * This index file exports all normalizer utilities from their respective modules.
 * It acts as a central point of access for all normalizer functionality, making
 * imports cleaner throughout the application.
 */
export {
  normalizeStructuredData,
  ensureString,
  normalizeObject,
  normalizeArray,
  createFallbackStructure,
  detectFormat,
  getEmptyStructure,
  normalizeSOAPFormat,
  normalizeConsultationFormat,
  normalizePrescriptionFormat,
  normalizeStandardFormat,
  processStringMedication,
  processIndividualMedication,
  parseComplexMedicationString
};
