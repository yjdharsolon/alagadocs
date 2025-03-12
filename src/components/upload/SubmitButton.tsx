
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isUploading: boolean;
  isRecording: boolean;
  hasFile: boolean;
  onSubmit: () => void;
  getStepLabel: () => string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isUploading,
  isRecording,
  hasFile,
  onSubmit,
  getStepLabel
}) => {
  // Use useCallback to memoize the handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Multiple layers of prevention for any form submission
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Add a small delay before calling onSubmit
    // This helps ensure any other click handlers have resolved
    setTimeout(() => {
      onSubmit();
    }, 10);
    
    // Return false to prevent default in older browsers
    return false;
  }, [onSubmit]);

  return (
    <Button 
      size="lg"
      onClick={handleClick}
      disabled={!hasFile || isUploading || isRecording}
      type="button" // Explicitly set as button, not submit
      role="button"
      aria-label={isUploading ? getStepLabel() : 'Continue to Transcription'}
      data-prevent-default="true" // Extra attribute to signal event handling
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {getStepLabel()}
        </>
      ) : (
        'Continue to Transcription'
      )}
    </Button>
  );
};
