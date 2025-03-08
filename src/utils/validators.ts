
/**
 * Validators for form inputs
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Password validation - at least 8 characters, one uppercase, one lowercase, one number
 */
export const isValidPassword = (password: string): boolean => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

/**
 * Check if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Check if string is empty or only whitespace
 */
export const isEmptyString = (str: string): boolean => {
  return str.trim() === '';
};

/**
 * Validate audio file type (mp3 or wav)
 */
export const isValidAudioFile = (file: File): boolean => {
  const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav'];
  return validTypes.includes(file.type);
};

/**
 * Validate file size (in MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Form validation - general purpose validation that returns errors object
 */
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => boolean>) => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, validationFn]) => {
    if (!validationFn(data[field])) {
      errors[field] = `Invalid ${field}`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
