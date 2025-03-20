
import { structureText } from './structureService';
import { enhancePrescriptionData } from './prescriptionEnhancer';
import { normalizeStructuredData } from './normalizers/dataNormalizer';
import { createFallbackStructure } from './normalizers/fallbackCreator';

export {
  structureText,
  enhancePrescriptionData,
  normalizeStructuredData,
  createFallbackStructure
};
