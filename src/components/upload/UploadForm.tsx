
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { useUploadForm } from '@/hooks/useUploadForm';
import { AuthenticationCheck } from './AuthenticationCheck';
import { FormSubmitHandler } from './FormSubmitHandler';
import { InputSelectionHandler } from './InputSelectionHandler';
import { UploadFormLayout } from './UploadFormLayout';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [directInput, setDirectInput] = useState<string>('');
  
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
    handleSubmit,
    getStepLabel,
    changePatient
  } = useUploadForm(patientId);
  
  if (!sessionChecked) {
    return <AuthenticationCheck isLoading={true} />;
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      {error && (
        <ErrorAlert 
          error={error} 
          onLogoutAndLogin={handleLogoutAndLogin} 
        />
      )}
      
      <InputSelectionHandler
        file={file}
        directInput={directInput}
      >
        {(inputMethod) => (
          <FormSubmitHandler
            directInput={directInput}
            inputMethod={inputMethod}
            patientId={patientId}
            patientName={patientName}
            file={file}
            isUploading={isUploading}
            isRecording={isRecording}
            handleSubmit={handleSubmit}
          >
            {(handleFormSubmit) => (
              <UploadFormLayout
                patientName={patientName || undefined}
                patientId={patientId}
                file={file}
                directInput={directInput}
                onFileSelect={handleFileSelect}
                onRecordingComplete={handleRecordingComplete}
                onDirectInputChange={setDirectInput}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                currentStep={currentStep}
                getStepLabel={getStepLabel}
                onSubmit={handleFormSubmit}
                inputMethod={inputMethod}
              />
            )}
          </FormSubmitHandler>
        )}
      </InputSelectionHandler>
    </div>
  );
};
