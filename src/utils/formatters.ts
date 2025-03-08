
/**
 * Formatters for data display
 */

/**
 * Format date to locale string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time to locale string
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format phone number (US)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phoneNumber;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format medical note structure
 */
export const formatMedicalNote = (note: {
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  assessment?: string;
  plan?: string;
}): string => {
  let formattedNote = '';
  
  if (note.chiefComplaint) {
    formattedNote += `CHIEF COMPLAINT:\n${note.chiefComplaint}\n\n`;
  }
  
  if (note.historyOfPresentIllness) {
    formattedNote += `HISTORY OF PRESENT ILLNESS:\n${note.historyOfPresentIllness}\n\n`;
  }
  
  if (note.assessment) {
    formattedNote += `ASSESSMENT:\n${note.assessment}\n\n`;
  }
  
  if (note.plan) {
    formattedNote += `PLAN:\n${note.plan}\n\n`;
  }
  
  return formattedNote;
};
