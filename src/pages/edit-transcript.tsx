
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import EditStep from '@/components/transcription/EditStep';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditTranscriptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [locationStateRecovered, setLocationStateRecovered] = useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  
  // Check for transcription completion from the background process
  const checkTranscriptionStatus = useCallback(() => {
    const isComplete = sessionStorage.getItem('transcriptionComplete');
    
    if (isComplete === 'true') {
      console.log('Detected transcription completion');
      sessionStorage.removeItem('transcriptionComplete');
      
      try {
        const savedData = sessionStorage.getItem('lastTranscriptionResult');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Update location with the completed data
          navigate('/edit-transcript', { 
            state: parsedData,
            replace: true
          });
          
          setLocationStateRecovered(true);
          setIsPending(false);
          setIsLoading(false);
          toast.success('Transcription completed successfully');
        }
      } catch (err) {
        console.error('Error recovering completed transcription data:', err);
      }
    }
  }, [navigate]);
  
  // Setup interval to check for transcription completion
  useEffect(() => {
    if (isPending) {
      const interval = setInterval(checkTranscriptionStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [isPending, checkTranscriptionStatus]);
  
  // Check for location state or pending transcription
  useEffect(() => {
    // If we have the isPending flag in location state, show the pending UI
    if (location.state?.isPending) {
      console.log('Detected pending transcription state');
      setIsPending(true);
      setPendingData(location.state.pendingData);
      setIsLoading(false);
      return;
    }
    
    // If we have complete transcription data
    if (location.state && location.state.transcriptionData) {
      console.log('Found complete transcription data in location state');
      setIsLoading(false);
      return;
    }
    
    // If no location state, try to recover from session storage
    if (!location.state) {
      console.log('No location state found, checking sessionStorage...');
      setRecoveryAttempted(true);
      
      // First check for pending transcription
      try {
        const pendingTranscription = sessionStorage.getItem('pendingTranscription');
        if (pendingTranscription) {
          console.log('Found pending transcription in sessionStorage');
          const parsedData = JSON.parse(pendingTranscription);
          setPendingData(parsedData);
          setIsPending(true);
          setIsLoading(false);
          return;
        }
      } catch (pendingErr) {
        console.error('Error checking pending transcription:', pendingErr);
      }
      
      // Then check for completed transcription
      try {
        const savedData = sessionStorage.getItem('lastTranscriptionResult');
        if (savedData) {
          console.log('Found saved transcription data in sessionStorage');
          const parsedData = JSON.parse(savedData);
          
          // Update location with the recovered data
          navigate('/edit-transcript', { 
            state: parsedData,
            replace: true
          });
          
          setLocationStateRecovered(true);
          toast.success('Recovered your transcription data');
        } else {
          console.log('No saved transcription data found');
          toast.error('No transcription data found');
          setTimeout(() => navigate('/upload'), 1500);
        }
      } catch (err) {
        console.error('Error recovering transcription data:', err);
        toast.error('Error loading transcription data');
        setTimeout(() => navigate('/upload'), 1500);
      }
    } else {
      setIsLoading(false);
    }
  }, [location.state, navigate]);
  
  // Update loading state when we've recovered data
  useEffect(() => {
    if (locationStateRecovered && location.state) {
      setIsLoading(false);
    } else if (recoveryAttempted && !locationStateRecovered && !location.state && !isPending) {
      // If we tried recovery but failed and still don't have state, redirect
      navigate('/upload');
    }
  }, [locationStateRecovered, location.state, recoveryAttempted, navigate, isPending]);
  
  // Setup transcription edit functionality with the location state
  const {
    transcriptionText,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  } = useTranscriptionEdit(location.state);

  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your transcription...</p>
        </div>
      </Layout>
    );
  }

  // Render pending transcription state with skeleton UI
  if (isPending) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-2">Processing Transcription</h1>
          <p className="text-muted-foreground mb-6">
            Your audio is being transcribed. Please wait...
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Processing</CardTitle>
                  <CardDescription>
                    Your audio is being analyzed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p className="text-sm">Transcribing audio to text...</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transcription</CardTitle>
                  <CardDescription>
                    Text will appear here once processing is complete
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-[90%] mb-2" />
                  <Skeleton className="h-4 w-[80%] mb-2" />
                  <Skeleton className="h-4 w-[85%] mb-2" />
                  <Skeleton className="h-4 w-[75%]" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render error state when no transcription is found
  if (!transcriptionText) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Card>
            <CardHeader>
              <CardTitle>No Transcription Found</CardTitle>
              <CardDescription>
                There was an issue loading your transcription data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Please return to the upload page and try again.</p>
              <button 
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => navigate('/upload')}
              >
                Return to Upload
              </button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Render normal edit view when transcription is available
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-2">Edit Transcript</h1>
        <p className="text-muted-foreground mb-6">
          Review and edit your transcription
        </p>

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
      </div>
    </Layout>
  );
}
