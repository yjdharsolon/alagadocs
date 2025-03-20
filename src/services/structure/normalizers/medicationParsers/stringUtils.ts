
/**
 * Ensures a value is a string.
 * Converts undefined, null, objects, and other non-string values to string representation.
 * 
 * @param value - The value to convert to a string
 * @returns A string representation of the value, or empty string if undefined/null
 */
export const ensureString = (value: any): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};
