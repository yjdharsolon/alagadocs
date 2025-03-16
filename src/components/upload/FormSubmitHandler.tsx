
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingTranscription from '../transcription/LoadingTranscription';
import { TextPreviewModal } from './TextPreviewModal';

interface FormSubmitHandlerProps {
  children: (handleSubmit: () => void) => React.ReactNode;
  directInput: string;
  inputMethod: 'audio' | 'text';
  patientId: string | null;
  patientName: string | null;
  file: File | null;
  isUploading: boolean;
  isRecording: boolean;
  handleSubmit: () => Promise<any>;
}

export const FormSubmitHandler: React.FC<FormSubmitHandlerProps> = ({
  children,
  directInput,
  inputMethod,
  patientId,
  patientName,
  file,
  isUploading,
  isRecording,
  handleSubmit: processUpload
}) => {
  const [navigating, setNavigating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

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
      const result = await processUpload();
      
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
        
        // Navigate to edit-transcript
        navigate('/edit-transcript', {
          state: {
            transcriptionData: result.transcriptionData,
            audioUrl: result.audioUrl || '',
            transcriptionId: result.transcriptionId || '',
            patientId: patientId || null,
            patientName: patientName || null
          }
        });
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
  }, [processUpload, navigate, patientId, patientName, inputMethod, directInput, showPreview]);
  
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

  if (navigating) {
    return <LoadingTranscription />;
  }

  return (
    <>
      {children(handleFormSubmit)}
      
      {/* Text preview modal */}
      <TextPreviewModal
        isOpen={showPreview}
        content={directInput}
        onClose={handlePreviewClose}
        onContinue={handlePreviewContinue}
      />
    </>
  );
};
