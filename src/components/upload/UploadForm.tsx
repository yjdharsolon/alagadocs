
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
import { Loader2 } from 'lucide-react';
import LoadingTranscription from '../transcription/LoadingTranscription';
import { useNavigate } from 'react-router-dom';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const { user, signOut } = useAuth();
  const [navigating, setNavigating] = useState(false);
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

  const handleSubmit = useCallback(async () => {
    try {
      console.log("Submit button clicked, handling submission...");
      setNavigating(true);
      
      const result = await originalHandleSubmit();
      
      if (result && result.transcriptionData) {
        console.log('Transcription completed, calling onTranscriptionComplete with results:', result);
        
        // First, ensure we push to session storage for recovery
        sessionStorage.setItem('lastTranscriptionResult', JSON.stringify({
          transcriptionData: result.transcriptionData,
          audioUrl: result.audioUrl || '',
          transcriptionId: result.transcriptionId || ''
        }));
        
        // Force navigation to edit-transcript
        if (onTranscriptionComplete) {
          onTranscriptionComplete(
            result.transcriptionData,
            result.audioUrl || '',
            result.transcriptionId || ''
          );
        } else {
          // If no callback provided, manually navigate
          navigate('/edit-transcript', {
            state: {
              transcriptionData: result.transcriptionData,
              audioUrl: result.audioUrl || '',
              transcriptionId: result.transcriptionId || ''
            }
          });
        }
      } else {
        // If no result, still attempt to navigate based on pending data
        const pendingData = sessionStorage.getItem('pendingTranscription');
        if (pendingData) {
          navigate('/edit-transcript?pending=true');
        } else {
          setNavigating(false);
          toast.error('Error completing transcription process');
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Error completing transcription process');
      setNavigating(false);
    }
  }, [originalHandleSubmit, onTranscriptionComplete, navigate]);
  
  if (!sessionChecked) {
    return <AuthenticationCheck isLoading={true} />;
  }
  
  if (navigating) {
    return <LoadingTranscription />;
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
          isUploading={isUploading}
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
