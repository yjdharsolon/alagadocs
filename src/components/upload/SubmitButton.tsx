
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
  return (
    <Button 
      size="lg" 
      onClick={(e) => {
        e.preventDefault(); // Prevent form submission
        onSubmit();
      }}
      disabled={!hasFile || isUploading || isRecording}
      type="button" // Change from 'submit' to 'button'
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
