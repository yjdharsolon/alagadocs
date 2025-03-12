
import React, { useState } from 'react';
import { CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { UploadProgress } from './UploadProgress';
import { SubmitButton } from './SubmitButton';
import { useUploadForm } from '@/hooks/useUploadForm';
import { toast } from 'sonner';
import { FileInputCard } from './FileInputCard';
import { RecordingCard } from './RecordingCard';
import { AuthenticationCheck } from './AuthenticationCheck';
import { useNavigate } from 'react-router-dom';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const { user, signOut } = useAuth();
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const navigate = useNavigate();
  
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
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault(); // Ensure form submission is prevented
    }
    
    try {
      console.log("Submit button clicked, handling submission...");
      // Prevent default submission behavior
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
        console.log('No callback provided, but transcription completed successfully. Navigating to edit-transcript...');
        
        // Use replace: true to avoid adding to history stack and prevent back-button issues
        navigate('/edit-transcript', { 
          state: { 
            transcriptionData: result.transcriptionData,
            audioUrl: result.audioUrl || '',
            transcriptionId: result.transcriptionId || ''
          },
          replace: true 
        });
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
        handleSubmit(); // Call without event to avoid any potential default behaviors
        setSimulationInProgress(false);
      }, 1000);
    }, 2000);
  };
  
  // Render loading state during authentication check
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
      
      {/* Use div instead of form to avoid form submission behavior */}
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
    </div>
  );
};
