
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Mic } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { AudioRecorder } from './audio-recorder';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { UploadProgress } from './UploadProgress';
import { SubmitButton } from './SubmitButton';
import { useUploadForm } from '@/hooks/useUploadForm';

export const UploadForm: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const {
    file,
    isUploading,
    isRecording,
    setIsRecording,
    uploadProgress,
    currentStep,
    error,
    handleFileSelect,
    handleRecordingComplete,
    handleLogoutAndLogin,
    handleSubmit,
    getStepLabel
  } = useUploadForm(user, signOut);
  
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <ErrorAlert 
          error={error} 
          onLogoutAndLogin={handleLogoutAndLogin} 
        />
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Audio File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploader 
            file={file} 
            onFileSelect={handleFileSelect} 
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </CardContent>
      </Card>
      
      {isUploading && (
        <UploadProgress 
          uploadProgress={uploadProgress} 
          currentStep={currentStep} 
        />
      )}
      
      <CardFooter className="px-0 flex justify-end">
        <SubmitButton
          isUploading={isUploading}
          isRecording={isRecording}
          hasFile={!!file}
          onSubmit={handleSubmit}
          getStepLabel={getStepLabel}
        />
      </CardFooter>
    </div>
  );
};
