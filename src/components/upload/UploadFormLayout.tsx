
import React from 'react';
import { FileInputCard } from './FileInputCard';
import { RecordingCard } from './RecordingCard';
import { DirectInputCard } from './DirectInputCard';
import { UploadProgress } from './UploadProgress';
import { SubmitButton } from './SubmitButton';
import { UploadStep } from '@/hooks/upload/useUploadProgress';

interface UploadFormLayoutProps {
  patientName?: string;
  patientId?: string | null;
  file: File | null;
  directInput: string;
  onFileSelect: (file: File) => void;
  onRecordingComplete: (file: File) => void;
  onDirectInputChange: (value: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  isUploading: boolean;
  uploadProgress: number;
  currentStep: UploadStep;
  getStepLabel: () => string;
  onSubmit: () => void;
  inputMethod: 'audio' | 'text';
}

export const UploadFormLayout: React.FC<UploadFormLayoutProps> = ({
  file,
  directInput,
  onFileSelect,
  onRecordingComplete,
  onDirectInputChange,
  isRecording,
  setIsRecording,
  isUploading,
  uploadProgress,
  currentStep,
  getStepLabel,
  onSubmit,
  inputMethod
}) => {
  return (
    <div className="space-y-6 mt-4">
      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio input section (left side) */}
        <div className="space-y-6">
          <FileInputCard 
            file={file} 
            onFileSelect={onFileSelect} 
          />
          
          <RecordingCard 
            onRecordingComplete={onRecordingComplete} 
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            isUploading={isUploading}
          />
        </div>
        
        {/* Direct text input section (right side) */}
        <div>
          <DirectInputCard 
            value={directInput}
            onChange={onDirectInputChange}
          />
        </div>
      </div>
      
      {isUploading && (
        <UploadProgress 
          uploadProgress={uploadProgress} 
          currentStep={currentStep} 
        />
      )}
      
      <div className="px-0 flex justify-center">
        <SubmitButton
          isUploading={isUploading}
          isRecording={isRecording}
          hasFile={file !== null || directInput.trim().length > 0}
          onSubmit={onSubmit}
          getStepLabel={getStepLabel}
          label={inputMethod === 'audio' ? 'Continue to Transcription' : 'Continue to Text Editing'}
        />
      </div>
    </div>
  );
};
