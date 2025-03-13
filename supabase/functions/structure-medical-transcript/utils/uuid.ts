
// UUID handling utility

// UUID v5 namespace (use a consistent namespace for reproducibility)
const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

/**
 * Checks if a string is a valid UUID format
 */
export function isUUID(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

/**
 * Ensures a string is converted to a valid UUID
 * If already a UUID, returns as is. Otherwise, generates a name-based UUID (v5)
 */
export function ensureUuid(str: string): string {
  if (isUUID(str)) {
    return str; // Already a valid UUID
  }
  
  return uuidv5(str, UUID_NAMESPACE);
}

/**
 * Simple implementation of UUID v5 algorithm for edge functions
 * This is a simplified version and may not be cryptographically secure
 */
function uuidv5(name: string, namespace: string): string {
  // Simple hash function (not cryptographically secure, just for demo)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert hash to hex and format as UUID
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  const uuid = namespace.substring(0, 24) + hashHex.substring(0, 12);
  
  // Format as UUID (8-4-4-4-12)
  return [
    uuid.substring(0, 8),
    uuid.substring(8, 12),
    uuid.substring(12, 16),
    uuid.substring(16, 20),
    uuid.substring(20, 32)
  ].join('-');
}
