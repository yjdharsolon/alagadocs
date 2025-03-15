
import { useEffect } from 'react';

export const useKeyboardControls = (
  togglePlayPause: () => void,
  skipBackward: () => void,
  skipForward: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        togglePlayPause();
      }
      
      if (e.code === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipBackward();
      }
      
      if (e.code === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipForward();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause, skipBackward, skipForward]);
};
