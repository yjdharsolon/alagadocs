
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { toast } from 'sonner';

// Import refactored components
import WorkflowHeader from '@/components/transcription/WorkflowHeader';
import TranscriptionStep from '@/components/transcription/TranscriptionStep';
import EditStep from '@/components/transcription/EditStep';

export default function UnifiedTranscriptionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('upload');
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcriptionId, setTranscriptionId] = useState<string>('');
  
  // Setup transcription edit functionality with local state
  const localState = transcriptionData ? {
    transcriptionData,
    audioUrl,
    transcriptionId
  } : null;
  
  const {
    transcriptionText,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  } = useTranscriptionEdit(localState);

  // Check if we already have data from location state
  useEffect(() => {
    if (location.state?.transcriptionData) {
      setTranscriptionData(location.state.transcriptionData);
      setAudioUrl(location.state.audioUrl || '');
      setTranscriptionId(location.state.transcriptionId || '');
      setActiveStep('transcribe');
    }
  }, [location.state]);
  
  // Handle completion of upload process
  const handleUploadComplete = (data: any, url: string, id: string) => {
    console.log('Upload complete! Received data:', data);
    setTranscriptionData(data);
    setAudioUrl(url);
    setTranscriptionId(id);
    setActiveStep('transcribe');
    
    // Show success notification
    toast.success('Transcription completed successfully!');
  };
  
  // Handle moving to edit step
  const handleStartEditing = () => {
    setActiveStep('edit');
  };
  
  // Add better error handling for user feedback
  const handleError = (error: any) => {
    console.error('Error in transcription workflow:', error);
    toast.error('Error processing transcription. Please try again.');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <WorkflowHeader 
          title="Transcription Workflow" 
          description="Upload, transcribe, and edit your audio in one place" 
        />
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="transcribe" disabled={!transcriptionData}>Transcribe</TabsTrigger>
            <TabsTrigger value="edit" disabled={!transcriptionData}>Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <UploadForm onTranscriptionComplete={handleUploadComplete} />
          </TabsContent>
          
          <TabsContent value="transcribe" className="mt-6">
            {transcriptionData && (
              <TranscriptionStep 
                transcriptionData={transcriptionData}
                audioUrl={audioUrl}
                onStartEditing={handleStartEditing}
              />
            )}
          </TabsContent>
          
          <TabsContent value="edit" className="mt-6">
            {transcriptionData && (
              <EditStep
                audioUrl={audioUrl}
                transcriptionText={transcriptionText}
                onTranscriptionChange={setTranscriptionText}
                onSave={handleSave}
                onContinueToStructured={handleContinueToStructured}
                isSaving={isSaving}
                saveError={error}
                saveSuccess={saveSuccess}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
