
// This file is kept for backward compatibility
// All functionality has been refactored into the normalizers/ directory

import { 
  normalizeStructuredData,
  ensureString,
  normalizeObject,
  normalizeArray,
  createFallbackStructure
} from './normalizers/index';

export {
  normalizeStructuredData,
  ensureString,
  normalizeObject,
  normalizeArray,
  createFallbackStructure
};
