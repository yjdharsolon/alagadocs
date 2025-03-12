
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Mic, Play } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { AudioRecorder } from './audio-recorder';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { UploadProgress } from './UploadProgress';
import { SubmitButton } from './SubmitButton';
import { useUploadForm } from '@/hooks/upload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

  // Wrap the handleSubmit function to intercept the result
  const handleSubmit = async () => {
    try {
      const result = await originalHandleSubmit();
      
      // If we have an onTranscriptionComplete callback and result data
      if (onTranscriptionComplete && result && result.transcriptionData) {
        console.log('Transcription completed, calling onTranscriptionComplete with results:', result);
        onTranscriptionComplete(
          result.transcriptionData,
          result.audioUrl || '',
          result.transcriptionId || ''
        );
      } else if (result && !onTranscriptionComplete) {
        // If no callback provided but transcription was successful, navigate programmatically
        console.log('No callback provided, but transcription completed successfully');
      } else if (!result) {
        console.error('Transcription failed or returned no results');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Error completing transcription process');
    }
  };
  
  // Function to simulate audio recording
  const simulateRecording = () => {
    setSimulationInProgress(true);
    toast.info("Simulating audio recording...");
    
    // Create a mock audio file after a short delay
    setTimeout(() => {
      // Create a small ArrayBuffer with mock audio data
      const arrayBuffer = new ArrayBuffer(44100); // 1 second of mock audio at 44.1kHz
      const mockAudioBlob = new Blob([arrayBuffer], { type: 'audio/webm' });
      
      // Create a File object from the Blob
      const mockFile = new File([mockAudioBlob], 'simulation-recording.webm', { 
        type: 'audio/webm',
        lastModified: Date.now() 
      });
      
      // Pass the mock file to the recording complete handler
      handleRecordingComplete(mockFile);
      toast.success("Simulated recording completed");
      
      // Automatically trigger the upload process after a short delay
      setTimeout(() => {
        handleSubmit();
        setSimulationInProgress(false);
      }, 1000);
    }, 2000);
  };
  
  // Show loading state while session is being checked
  if (!sessionChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }
  
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
          
          {/* Simulation button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              type="button"
              onClick={simulateRecording}
              disabled={isUploading || isRecording || simulationInProgress}
              className="w-full flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Simulate Recording & Upload
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will create a mock audio file and attempt the upload process
            </p>
          </div>
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
