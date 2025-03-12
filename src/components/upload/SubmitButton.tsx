
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
    
    // Check if we have a file
    if (!hasFile) {
      console.log('Button clicked without a file, ignoring');
      return false;
    }
    
    console.log('Submit button clicked, initiating upload process');
    
    // Execute the onSubmit callback immediately
    onSubmit();
    
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
