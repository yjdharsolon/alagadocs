
import { useState, useEffect } from 'react';

export const useInputMethod = (file: File | null, directInput: string) => {
  const [inputMethod, setInputMethod] = useState<'audio' | 'text'>('audio');
  
  // Determine which input method is active based on whether there's a file or direct input text
  const determineActiveInputMethod = () => {
    if (file) return 'audio';
    if (directInput.trim().length > 0) return 'text';
    return inputMethod; // Default to the selected input method
  };
  
  // Update the input method based on user interaction
  useEffect(() => {
    setInputMethod(determineActiveInputMethod());
  }, [file, directInput]);
  
  return inputMethod;
};
