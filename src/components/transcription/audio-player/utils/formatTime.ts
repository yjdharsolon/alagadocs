
/**
 * Format seconds into a MM:SS format for audio display
 */
export const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return '00:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
