
/**
 * Format seconds into a MM:SS format for audio display
 */
export const formatTime = (seconds: number): string => {
  // Handle invalid inputs (NaN, Infinity, negative values)
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  
  // Round to the nearest integer
  const roundedSeconds = Math.round(seconds);
  
  const mins = Math.floor(roundedSeconds / 60);
  const secs = Math.floor(roundedSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
