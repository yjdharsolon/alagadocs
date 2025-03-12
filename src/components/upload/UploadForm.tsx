
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { UploadProgress } from './UploadProgress';
import { SubmitButton } from './SubmitButton';
import { useUploadForm } from '@/hooks/useUploadForm';
import { toast } from 'sonner';
import { FileInputCard } from './FileInputCard';
import { RecordingCard } from './RecordingCard';
import { AuthenticationCheck } from './AuthenticationCheck';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const { user, signOut } = useAuth();
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  
  const {
    file,
    isUploading,
    isRecording,
    setIsRecording,
    uploadProgress,
    currentStep,
    error,
    sessionChecked,
    handleFileSelect,
    handleRecordingComplete,
    handleLogoutAndLogin,
    handleSubmit: originalHandleSubmit,
    getStepLabel
  } = useUploadForm(user, signOut);

  // Use useCallback to memoize the handler
  const handleSubmit = useCallback(async () => {
    try {
      console.log("Submit button clicked, handling submission...");
      
      const result = await originalHandleSubmit();
      
      if (onTranscriptionComplete && result && result.transcriptionData) {
        console.log('Transcription completed, calling onTranscriptionComplete with results:', result);
        onTranscriptionComplete(
          result.transcriptionData,
          result.audioUrl || '',
          result.transcriptionId || ''
        );
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Error completing transcription process');
    }
  }, [originalHandleSubmit, onTranscriptionComplete]);
  
  const simulateRecording = useCallback(() => {
    setSimulationInProgress(true);
    toast.info("Simulating audio recording...");
    
    setTimeout(() => {
      const arrayBuffer = new ArrayBuffer(44100);
      const mockAudioBlob = new Blob([arrayBuffer], { type: 'audio/webm' });
      const mockFile = new File([mockAudioBlob], 'simulation-recording.webm', { 
        type: 'audio/webm',
        lastModified: Date.now() 
      });
      
      handleRecordingComplete(mockFile);
      toast.success("Simulated recording completed");
      
      setTimeout(() => {
        handleSubmit();
        setSimulationInProgress(false);
      }, 1000);
    }, 2000);
  }, [handleRecordingComplete, handleSubmit]);
  
  if (!sessionChecked) {
    return <AuthenticationCheck isLoading={true} />;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <ErrorAlert 
          error={error} 
          onLogoutAndLogin={handleLogoutAndLogin} 
        />
      )}
      
      <div className="space-y-6">
        <FileInputCard 
          file={file} 
          onFileSelect={handleFileSelect} 
        />
        
        <RecordingCard 
          onRecordingComplete={handleRecordingComplete} 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onSimulate={simulateRecording}
          isUploading={isUploading}
          isSimulating={simulationInProgress}
        />
        
        {isUploading && (
          <UploadProgress 
            uploadProgress={uploadProgress} 
            currentStep={currentStep} 
          />
        )}
        
        <div className="px-0 flex justify-end">
          <SubmitButton
            isUploading={isUploading}
            isRecording={isRecording}
            hasFile={!!file}
            onSubmit={handleSubmit}
            getStepLabel={getStepLabel}
          />
        </div>
      </div>
    </div>
  );
};
