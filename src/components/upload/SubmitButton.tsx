
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
    // Prevent any default behavior that might cause page refresh
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
      type="button" // Ensure it's a button, not a submit type
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
