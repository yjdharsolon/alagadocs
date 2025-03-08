
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileAudio, Mic, Upload } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

export default function AudioUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error('File size should not exceed 100MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file type
      if (!droppedFile.type.includes('audio/')) {
        toast.error('Please drop an audio file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (droppedFile.size > 100 * 1024 * 1024) {
        toast.error('File size should not exceed 100MB');
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
        const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
        setFile(audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      setIsRecording(true);
      mediaRecorder.start();
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please ensure microphone permissions are enabled.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingTime(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select or record an audio file first');
      return;
    }
    
    setUploading(true);
    
    // Simulate upload progress for now
    // In the actual implementation, we would upload to Supabase Storage
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploading(false);
      toast.success('Upload successful!');
      navigate('/transcribe');
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Audio Upload & Recording</h1>
          <p className="text-muted-foreground mb-6">
            Upload an audio file or record your voice for transcription
          </p>
          
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload Audio</TabsTrigger>
              <TabsTrigger value="record">Record Voice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-5 w-5" />
                    Upload Audio File
                  </CardTitle>
                  <CardDescription>
                    Upload an MP3 or WAV file containing the audio you want to transcribe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={preventDefault}
                    onDragEnter={preventDefault}
                  >
                    <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2 font-medium">Drag and drop your audio file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse (MP3, WAV up to 100MB)</p>
                    <Input 
                      ref={fileInputRef}
                      type="file" 
                      accept="audio/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {file && (
                      <Alert className="mt-4 mx-auto max-w-md">
                        <FileAudio className="h-4 w-4" />
                        <AlertTitle>File selected</AlertTitle>
                        <AlertDescription className="truncate">
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleUpload}
                    disabled={!file || uploading}
                  >
                    {uploading ? `Uploading... ${uploadProgress}%` : 'Upload and Transcribe'}
                  </Button>
                </CardFooter>
                {uploading && (
                  <div className="px-6 pb-6">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="record">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Record Your Voice
                  </CardTitle>
                  <CardDescription>
                    Record your voice directly through your device's microphone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-10">
                    <div className={`rounded-full p-10 mx-auto mb-6 inline-flex ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-slate-100'}`}>
                      <Mic className={`h-16 w-16 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
                    </div>
                    {isRecording ? (
                      <div className="mb-6">
                        <p className="text-xl font-bold text-red-500 mb-2">Recording... {formatTime(recordingTime)}</p>
                        <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <p className="font-medium mb-2">Click to start recording your voice</p>
                        <p className="text-sm text-muted-foreground">Make sure your microphone is working properly</p>
                      </div>
                    )}
                    {file && !isRecording && (
                      <Alert className="mt-4 mx-auto max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Recording saved</AlertTitle>
                        <AlertDescription>
                          {formatTime(Math.floor(file.size / 16000))} long recording ready for upload
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {!isRecording ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={startRecording}
                        disabled={uploading}
                      >
                        Start Recording
                      </Button>
                      {file && (
                        <Button 
                          className="w-full" 
                          onClick={handleUpload}
                          disabled={uploading}
                        >
                          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload and Transcribe'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  )}
                </CardFooter>
                {uploading && (
                  <div className="px-6 pb-6">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
