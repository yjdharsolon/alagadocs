
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, Mic, Loader2 } from 'lucide-react';
import { uploadAudio } from '@/services/audioService';
import toast from 'react-hot-toast';
import { FileUploader } from './FileUploader';
import { AudioRecorder } from './AudioRecorder';

export const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };
  
  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setIsRecording(false);
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload or record an audio file first');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload the audio file to Supabase storage
      const audioUrl = await uploadAudio(file);
      
      // After successful upload, navigate to the transcribe page with the audio URL
      toast.success('Audio uploaded successfully');
      
      // Navigate to transcribe page with the audio URL
      navigate('/transcribe', { state: { audioUrl } });
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Error uploading audio. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
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
      
      <CardFooter className="px-0 flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSubmit}
          disabled={!file || isUploading || isRecording}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Continue to Transcription'
          )}
        </Button>
      </CardFooter>
    </div>
  );
};
