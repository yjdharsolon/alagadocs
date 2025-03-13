
import { v5 as uuidv5, validate as isValidUuid } from 'uuid';

// UUID namespace for generating consistent UUIDs from strings
// This is a random UUID used as a namespace for our application
const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

/**
 * Validates if a string is a valid UUID
 * @param str The string to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str) || isValidUuid(str);
};

/**
 * Converts any string to a valid UUID (v5) consistently
 * @param str The string to convert to UUID
 * @returns A valid UUID string
 */
export const ensureUuid = (str: string): string => {
  if (isUUID(str)) {
    return str; // Already a valid UUID
  }
  
  // Generate a name-based UUID (v5) which will be consistent for the same input
  return uuidv5(str, UUID_NAMESPACE);
};
