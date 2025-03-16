
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isUploading: boolean;
  isRecording: boolean;
  hasFile: boolean;
  onSubmit: () => void;
  getStepLabel: () => string;
  label?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isUploading,
  isRecording,
  hasFile,
  onSubmit,
  getStepLabel,
  label = 'Continue to Transcription'
}) => {
  // Use useCallback to memoize the handler with improved event prevention
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Stop any form submission or default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Stop any further propagation
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    // Ensure we're not in the middle of recording or uploading
    if (isRecording || isUploading) {
      console.log('Button clicked while recording or uploading, ignoring');
      return false;
    }
    
    // Check if we have a file or text input
    if (!hasFile) {
      console.log('Button clicked without a file or text input, ignoring');
      return false;
    }
    
    console.log('Submit button clicked, initiating process');
    
    // Use requestAnimationFrame to ensure UI updates before heavy processing
    requestAnimationFrame(() => {
      // Execute the onSubmit callback immediately
      onSubmit();
    });
    
    // Return false to prevent any default in older browsers
    return false;
  }, [onSubmit, isRecording, isUploading, hasFile]);

  return (
    <Button 
      size="lg"
      onClick={handleClick}
      disabled={!hasFile || isUploading || isRecording}
      type="button" // Explicitly set as button, not submit
      role="button"
      aria-label={isUploading ? getStepLabel() : label}
      data-prevent-default="true" // Extra attribute to signal event handling
      className="transition-all bg-[#33C3F0] hover:bg-[#1EAEDB] text-white"
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {getStepLabel()}
        </>
      ) : (
        label
      )}
    </Button>
  );
};
