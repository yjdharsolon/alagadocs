
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, Mic, Loader2, AlertCircle } from 'lucide-react';
import { uploadAudio, transcribeAudio } from '@/services/audioService';
import { toast } from 'sonner';
import { FileUploader } from './FileUploader';
import { AudioRecorder } from './audio-recorder';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'transcribing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };
  
  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setIsRecording(false);
    setError(null);
    toast.success('Recording saved successfully');
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload or record an audio file first');
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to upload audio');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      setCurrentStep('uploading');
      setUploadProgress(0);
      setError(null);
      
      // More gradual progress updates for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 75) return prev + 2;
          return prev;
        });
      }, 300);
      
      // Upload the audio file to Supabase storage
      const audioUrl = await uploadAudio(file);
      
      clearInterval(progressInterval);
      setUploadProgress(80);
      setCurrentStep('transcribing');
      
      // Transcribe the audio
      const transcriptionData = await transcribeAudio(audioUrl);
      
      setUploadProgress(100);
      
      // After successful transcription, navigate to the transcribe page with the data
      toast.success('Transcription completed successfully');
      
      // Navigate to transcribe page with the transcription data
      navigate('/transcribe', { 
        state: { 
          transcriptionData,
          audioUrl,
          transcriptionId: Date.now().toString() // Temporary ID for demo
        } 
      });
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication error')) {
        setError('Authentication error. Please log in again.');
        toast.error('Authentication error. Please log in again.');
        navigate('/login');
        return;
      }
      
      setError(error instanceof Error ? error.message : 'Error uploading audio. Please try again.');
      toast.error('Error uploading audio. Please try again.');
    } finally {
      setIsUploading(false);
      setCurrentStep('idle');
    }
  };
  
  const getStepLabel = () => {
    switch (currentStep) {
      case 'uploading': return 'Uploading Audio...';
      case 'transcribing': return 'Transcribing Audio...';
      default: return 'Continue to Transcription';
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
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
        </CardContent>
      </Card>
      
      {isUploading && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>{currentStep === 'uploading' ? 'Uploading' : 'Transcribing'}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <CardFooter className="px-0 flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSubmit}
          disabled={!file || isUploading || isRecording}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getStepLabel()}
            </>
          ) : (
            'Continue to Transcription'
          )}
        </Button>
      </CardFooter>
    </div>
  );
};
