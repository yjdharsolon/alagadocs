
import React, { useState, useCallback, useEffect } from 'react';
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
import { PatientInfoCard } from './PatientInfoCard';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const { user, signOut } = useAuth();
  const [navigating, setNavigating] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get patient info from session storage
  useEffect(() => {
    const selectedPatientJson = sessionStorage.getItem('selectedPatient');
    if (selectedPatientJson) {
      try {
        const patientData = JSON.parse(selectedPatientJson);
        setPatientId(patientData.id);
        setPatientName(`${patientData.first_name} ${patientData.last_name}`);
      } catch (error) {
        console.error('Error parsing patient data:', error);
      }
    }
  }, []);
  
  const {
    file,
    setFile,
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
  } = useUploadForm(user, signOut, patientId);

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
          transcriptionId: result.transcriptionId || '',
          patientId: patientId || null,
          patientName: patientName || null
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
              transcriptionId: result.transcriptionId || '',
              patientId: patientId || null,
              patientName: patientName || null
            }
          });
        }
      } else {
        // If no result, still attempt to navigate based on pending data
        const pendingData = sessionStorage.getItem('pendingTranscription');
        if (pendingData) {
          // Add patient data to pending transcription
          const pendingObj = JSON.parse(pendingData);
          pendingObj.patientId = patientId;
          pendingObj.patientName = patientName;
          sessionStorage.setItem('pendingTranscription', JSON.stringify(pendingObj));
          
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
  }, [originalHandleSubmit, onTranscriptionComplete, navigate, patientId, patientName]);
  
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
        {/* Display patient information if available */}
        <PatientInfoCard patientName={patientName || undefined} patientId={patientId} />
        
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
        
        <div className="px-0 flex justify-center">
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
