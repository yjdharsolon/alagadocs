
/**
 * Format content for display and editing
 */
export const formatContent = (content: any): string => {
  if (content === undefined || content === null) {
    return '';
  }
  
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle arrays
  if (Array.isArray(content)) {
    return content.map(item => 
      typeof item === 'string' ? item : JSON.stringify(item, null, 2)
    ).join('\n');
  }
  
  // Handle objects
  return JSON.stringify(content, null, 2);
};
