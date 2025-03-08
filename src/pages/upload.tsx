
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Upload, StopCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const AudioUploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording function
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setAudioFile(audioFile);
        toast.success('Recording saved!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is audio
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload an audio file.');
        return;
      }
      setAudioFile(file);
      toast.success('File selected!');
    }
  };

  // Handle upload to Supabase
  const handleUpload = async () => {
    if (!audioFile || !user) return;
    
    try {
      setIsUploading(true);
      
      // Create a unique file path
      const filePath = `${user.id}/${Date.now()}-${audioFile.name}`;
      
      // Start the upload
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(filePath, audioFile);
      
      if (error) throw error;
      
      // Simulate upload progress with intervals
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('Upload complete!');
          // Navigate to transcription page
          navigate('/transcribe', { 
            state: { 
              audioPath: filePath 
            } 
          });
        }
      }, 300);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      toast.error(error.message || 'Error uploading file');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Audio Upload & Recording</h1>
        
        <Tabs defaultValue="upload" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Audio</TabsTrigger>
            <TabsTrigger value="record">Record Audio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Audio File</CardTitle>
                <CardDescription>
                  Upload an audio file (MP3, WAV) to transcribe using AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP3, WAV up to 100MB</p>
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                
                {audioFile && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Selected file: {audioFile.name}</p>
                    <p className="text-xs text-gray-500">Size: {(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
                
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }} 
                    ></div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleUpload}
                  disabled={!audioFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload and Transcribe'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="record">
            <Card>
              <CardHeader>
                <CardTitle>Record Audio</CardTitle>
                <CardDescription>
                  Record audio directly through your microphone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  {isRecording ? (
                    <div className="animate-pulse">
                      <StopCircle className="h-20 w-20 text-red-500" />
                      <p className="mt-4 text-center text-gray-600">Recording in progress...</p>
                    </div>
                  ) : (
                    <div>
                      <Mic className="h-20 w-20 text-gray-500" />
                      <p className="mt-4 text-center text-gray-600">Click the button below to start recording</p>
                    </div>
                  )}
                  
                  {audioFile && !isRecording && (
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium">Recording saved!</p>
                      <p className="text-xs text-gray-500">Ready to transcribe</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {isRecording ? (
                  <Button 
                    variant="destructive" 
                    onClick={stopRecording}
                    className="flex items-center gap-2"
                  >
                    <StopCircle className="h-4 w-4" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={startRecording}
                    className="flex items-center gap-2"
                    disabled={!!audioFile}
                  >
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                )}
                
                {audioFile && !isRecording && (
                  <Button 
                    className="ml-4" 
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload and Transcribe'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AudioUploadPage;
