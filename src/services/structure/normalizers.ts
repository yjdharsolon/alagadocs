
// This file is kept for backward compatibility
// All functionality has been refactored into the normalizers/ directory

import { 
  normalizeStructuredData,
  ensureString,
  normalizeObject,
  normalizeArray,
  createFallbackStructure
} from './normalizers/index';

/**
 * @deprecated This file is maintained for backward compatibility.
 * Import from '@/services/structure/normalizers' instead.
 * 
 * This file re-exports all normalizer functions from their new locations
 * to maintain compatibility with existing code that imports from this file.
 */
export {
  normalizeStructuredData,
  ensureString,
  normalizeObject,
  normalizeArray,
  createFallbackStructure
};
