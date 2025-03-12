
import React from 'react';
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
  const handleClick = (e: React.MouseEvent) => {
    // Ensure we prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Call the submit handler
    onSubmit();
  };

  return (
    <Button 
      size="lg" 
      onClick={handleClick}
      disabled={!hasFile || isUploading || isRecording}
      type="button"
      role="button"
      aria-label={isUploading ? getStepLabel() : 'Continue to Transcription'}
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
