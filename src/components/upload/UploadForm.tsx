
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
import { DirectInputCard } from './DirectInputCard';
import { TextPreviewModal } from './TextPreviewModal';

interface UploadFormProps {
  onTranscriptionComplete?: (transcriptionData: any, audioUrl: string, transcriptionId: string) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onTranscriptionComplete }) => {
  const [navigating, setNavigating] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<'audio' | 'text'>('audio');
  const [directInput, setDirectInput] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
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

  const handleFormSubmit = useCallback(async () => {
    try {
      // If using direct text input, show preview first
      if (directInput.trim() !== '' && inputMethod === 'text') {
        if (!showPreview) {
          setShowPreview(true);
          return;
        }
      }

      console.log("Submit button clicked, handling submission...");
      setNavigating(true);
      
      // Handle direct text input separately
      if (directInput.trim() !== '' && inputMethod === 'text') {
        // Create a transcription-like object with the direct input
        const directInputResult = {
          transcriptionData: {
            text: directInput,
            duration: null // No duration for direct input
          },
          audioUrl: '', // No audio for direct input
          transcriptionId: `direct-${Date.now()}`, // Generate an ID
          patientId: patientId || null,
          patientName: patientName || null
        };
        
        // Store in session storage for recovery
        sessionStorage.setItem('lastTranscriptionResult', JSON.stringify(directInputResult));
        
        // Navigate to edit transcript
        navigate('/edit-transcript', {
          state: directInputResult
        });
        return;
      }
      
      // Handle audio upload/recording
      const result = await handleSubmit();
      
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
  }, [handleSubmit, onTranscriptionComplete, navigate, patientId, patientName, inputMethod, directInput, showPreview]);
  
  // Close preview and continue
  const handlePreviewClose = () => {
    setShowPreview(false);
  };
  
  // Close preview and continue
  const handlePreviewContinue = () => {
    setShowPreview(false);
    // Re-trigger submit after preview is closed
    setTimeout(() => handleFormSubmit(), 100);
  };
  
  // Determine which input method is active based on whether there's a file or direct input text
  const determineActiveInputMethod = () => {
    if (file) return 'audio';
    if (directInput.trim().length > 0) return 'text';
    return inputMethod; // Default to the selected input method
  };
  
  // Update the input method based on user interaction
  useEffect(() => {
    setInputMethod(determineActiveInputMethod());
  }, [file, directInput]);
  
  if (!sessionChecked) {
    return <AuthenticationCheck isLoading={true} />;
  }
  
  if (navigating) {
    return <LoadingTranscription />;
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      {error && (
        <ErrorAlert 
          error={error} 
          onLogoutAndLogin={handleLogoutAndLogin} 
        />
      )}
      
      <div className="space-y-6">
        {/* Display patient information if available */}
        <PatientInfoCard patientName={patientName || undefined} patientId={patientId} />
        
        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio input section (left side) */}
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
          </div>
          
          {/* Direct text input section (right side) */}
          <div>
            <DirectInputCard 
              value={directInput}
              onChange={setDirectInput}
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
            onSubmit={handleFormSubmit}
            getStepLabel={getStepLabel}
            label={determineActiveInputMethod() === 'audio' ? 'Continue to Transcription' : 'Continue to Text Editing'}
          />
        </div>
      </div>
      
      {/* Text preview modal */}
      <TextPreviewModal
        isOpen={showPreview}
        content={directInput}
        onClose={handlePreviewClose}
        onContinue={handlePreviewContinue}
      />
    </div>
  );
};
