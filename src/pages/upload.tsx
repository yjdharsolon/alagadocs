
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { Mic, Upload, StopCircle, File } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';

const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
        const file = new File([audioBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
        setAudioFile(file);
        setIsRecording(false);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isAudioFile(file)) {
        setAudioFile(file);
      } else {
        toast.error('Please upload a valid audio file (MP3 or WAV)');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isAudioFile(file)) {
        setAudioFile(file);
      } else {
        toast.error('Please upload a valid audio file (MP3 or WAV)');
      }
    }
  };

  const isAudioFile = (file: File) => {
    return file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/x-wav';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const uploadAudio = async () => {
    if (!audioFile || !user) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique filename to avoid conflicts
      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Track upload progress
      let lastLoaded = 0;
      const uploadProgressCallback = (progress: { loaded: number; total: number }) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        if (percent > lastLoaded) {
          lastLoaded = percent;
          setUploadProgress(percent);
        }
      };
      
      // Upload to Supabase Storage
      const { error, data } = await supabase.storage
        .from('audio_uploads')
        .upload(fileName, audioFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('audio_uploads')
        .getPublicUrl(fileName);
      
      toast.success('Audio uploaded successfully!');
      
      // Redirect to transcription page with file information
      navigate('/transcribe', { 
        state: { 
          audioUrl: publicUrl,
          fileName: audioFile.name,
          fileSize: audioFile.size,
          duration: recordingTime > 0 ? recordingTime : undefined 
        } 
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Failed to upload audio file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Audio Upload & Recording</CardTitle>
            <CardDescription>
              Upload an audio file or record your voice to create a medical transcription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                <TabsTrigger value="record">Record Voice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div 
                  ref={dropzoneRef}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/mpeg,audio/wav"
                    className="hidden"
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop an audio file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports MP3 and WAV files
                  </p>
                </div>
                
                {audioFile && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-md">
                    <File className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{audioFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="record" className="space-y-4">
                <div className="text-center p-10 border rounded-lg">
                  {isRecording ? (
                    <div className="space-y-4">
                      <div className="animate-pulse mx-auto h-16 w-16 rounded-full bg-red-500 flex items-center justify-center">
                        <StopCircle className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-lg font-medium">Recording... {formatTime(recordingTime)}</p>
                      <Button 
                        variant="destructive" 
                        onClick={stopRecording}
                        className="flex items-center gap-2"
                      >
                        <StopCircle className="h-4 w-4" />
                        Stop Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button 
                        className="mx-auto h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                        onClick={startRecording}
                      >
                        <Mic className="h-8 w-8 text-white" />
                      </button>
                      <p className="text-base text-gray-500">Click to start recording</p>
                    </div>
                  )}
                  
                  {audioFile && !isRecording && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium">Recording saved ({formatTime(recordingTime)})</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={uploadAudio} 
              disabled={!audioFile || isUploading} 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? `Uploading (${uploadProgress}%)` : 'Upload and Transcribe'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default function UploadPageWrapper() {
  return (
    <ProtectedRoute>
      <UploadPage />
    </ProtectedRoute>
  );
}
