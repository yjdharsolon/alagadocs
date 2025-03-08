
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Transcribe() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Get the transcription data from the location state
  const transcriptionData = location.state?.transcriptionData;
  const transcriptionId = location.state?.transcriptionId;
  const stateAudioUrl = location.state?.audioUrl;
  
  useEffect(() => {
    if (stateAudioUrl) {
      setAudioUrl(stateAudioUrl);
    }
  }, [stateAudioUrl]);
  
  // If no transcription data is available, redirect to upload page
  if (!transcriptionData || !transcriptionId) {
    toast.error('No transcription data found. Please upload an audio file first.');
    navigate('/upload');
    return null;
  }
  
  const handleBackToUpload = () => {
    navigate('/upload');
  };
  
  const handleStructureText = () => {
    navigate('/structured-output', { 
      state: { 
        transcriptionData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToUpload}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upload
          </Button>
          
          <h1 className="text-2xl font-bold">Transcription</h1>
          
          <Button 
            onClick={handleStructureText}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Structure Text
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                {transcriptionData ? (
                  <div className="prose max-w-none">
                    <h2 className="text-lg font-medium mb-4">Transcribed Text</h2>
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                      {transcriptionData.text}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}
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
      </div>
    </Layout>
  );
}
