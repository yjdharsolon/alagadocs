
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  uploadProgress: number;
  currentStep: 'idle' | 'uploading' | 'transcribing' | 'verifying';
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ 
  uploadProgress, 
  currentStep 
}) => {
  const getStepLabel = () => {
    switch (currentStep) {
      case 'verifying': return 'Verifying';
      case 'uploading': return 'Uploading';
      case 'transcribing': return 'Transcribing';
      default: return '';
    }
  };
  
  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between text-sm">
        <span>{getStepLabel()}</span>
        <span>{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
    </div>
  );
};
