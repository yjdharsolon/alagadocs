
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import TranscriptionEditor from '@/components/transcription/TranscriptionEditor';
import AudioPlayer from '@/components/transcription/AudioPlayer';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
        <h1 className="text-3xl font-bold mb-2">Transcription Workflow</h1>
        <p className="text-muted-foreground mb-6">
          Upload, transcribe, and edit your audio in one place
        </p>
        
        <Alert className="mb-6" variant="default">
          <Info className="h-4 w-4" />
          <AlertDescription>
            All steps of the transcription process are now combined on a single page for easier workflow.
          </AlertDescription>
        </Alert>
        
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <h2 className="text-lg font-medium mb-4">Transcribed Text</h2>
                        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                          {transcriptionData.text}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={handleStartEditing}>
                          Edit Transcription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-medium mb-4">Audio Recording</h2>
                      
                      {audioUrl ? (
                        <div className="flex flex-col items-center">
                          <audio 
                            src={audioUrl} 
                            controls 
                            className="w-full mb-4"
                          ></audio>
                          <p className="text-sm text-muted-foreground text-center">
                            You can replay the audio to check the accuracy of the transcription.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-muted-foreground">No audio available</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <h3 className="text-md font-medium mb-2">Transcription Details</h3>
                        <div className="text-sm">
                          <p><span className="font-medium">Duration:</span> {transcriptionData.duration?.toFixed(2) || 'N/A'} seconds</p>
                          <p><span className="font-medium">Language:</span> {transcriptionData.language || 'English'}</p>
                          <p><span className="font-medium">Created:</span> {new Date().toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="edit" className="mt-6">
            {transcriptionData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <AudioPlayer audioUrl={audioUrl} />
                </div>
                
                <div className="lg:col-span-2">
                  <TranscriptionEditor
                    transcriptionText={transcriptionText}
                    onTranscriptionChange={setTranscriptionText}
                    onSave={handleSave}
                    onContinueToStructured={handleContinueToStructured}
                    isSaving={isSaving}
                    saveError={error}
                    saveSuccess={saveSuccess}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
