
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, Mic, Upload, Loader2 } from 'lucide-react';
import { uploadAudio } from '@/services/transcriptionService';
import toast from 'react-hot-toast';

export default function AudioUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();
  
  // Timer for recording duration
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('audio/')) {
        toast.error('Please upload an audio file');
        return;
      }
      
      // Check file size (limit to 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size should be less than 50MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        setFile(audioFile);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording finished');
    }
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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Upload Audio</h1>
          <p className="text-muted-foreground mb-6">
            Upload an audio file or record your voice to transcribe
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5" />
                Audio File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={handleUploadClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="audio/*" 
                  onChange={handleFileChange}
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">
                  Drag and drop an audio file or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports MP3, WAV, M4A, and other audio formats (max 50MB)
                </p>
              </div>
              
              {file && !isRecording && (
                <div className="bg-accent/30 p-4 rounded-lg flex items-center">
                  <FileAudio className="h-8 w-8 mr-4" />
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
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
              <div className="text-center">
                {isRecording ? (
                  <div className="space-y-4">
                    <div className="animate-pulse flex items-center justify-center p-4">
                      <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <p className="text-xl font-bold">{formatTime(recordingTime)}</p>
                    <Button 
                      variant="destructive" 
                      size="lg" 
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-20 w-20 rounded-full"
                    onClick={startRecording}
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                )}
                
                {!isRecording && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Click to start recording your voice
                  </p>
                )}
              </div>
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
      </div>
    </Layout>
  );
}
