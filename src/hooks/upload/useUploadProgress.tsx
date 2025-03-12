
import { useState } from 'react';

export type UploadStep = 'idle' | 'uploading' | 'transcribing' | 'verifying';

export const useUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<UploadStep>('idle');

  const startProgressTracking = () => {
    setCurrentStep('verifying');
    setUploadProgress(5);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev < 75) return prev + 1;
        return prev;
      });
    }, 100);
    
    return progressInterval;
  };

  const updateProgressForUpload = () => {
    setCurrentStep('uploading');
    setUploadProgress(10);
  };

  const updateProgressForTranscription = () => {
    setUploadProgress(80);
    setCurrentStep('transcribing');
  };

  const completeProgress = () => {
    setUploadProgress(100);
  };

  const resetProgress = () => {
    setUploadProgress(0);
    setCurrentStep('idle');
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 'verifying': return 'Verifying Authentication...';
      case 'uploading': return 'Uploading Audio...';
      case 'transcribing': return 'Transcribing Audio...';
      default: return 'Continue to Transcription';
    }
  };

  return {
    uploadProgress,
    currentStep,
    startProgressTracking,
    updateProgressForUpload,
    updateProgressForTranscription,
    completeProgress,
    resetProgress,
    getStepLabel
  };
};
