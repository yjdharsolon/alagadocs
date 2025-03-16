
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadStep } from '@/hooks/upload/useUploadProgress';

interface UploadProgressProps {
  uploadProgress: number;
  currentStep: UploadStep;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ uploadProgress, currentStep }) => {
  const getStepMessage = () => {
    switch (currentStep) {
      case 'verifying':
        return 'Verifying Authentication...';
      case 'uploading':
        return 'Uploading Audio...';
      case 'transcribing':
        return 'Transcribing Audio...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{getStepMessage()}</p>
        <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
      </div>
      <Progress value={uploadProgress} className="w-full" />
    </div>
  );
};
