
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import EditStep from '@/components/transcription/EditStep';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditTranscriptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [locationStateRecovered, setLocationStateRecovered] = useState(false);
  
  // Check for location state; if missing, try to recover from sessionStorage
  useEffect(() => {
    if (!location.state) {
      console.log('No location state found, checking sessionStorage...');
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
          navigate('/upload');
        }
      } catch (err) {
        console.error('Error recovering transcription data:', err);
        toast.error('Error loading transcription data');
        navigate('/upload');
      }
    } else {
      setIsLoading(false);
    }
  }, [location.state, navigate]);
  
  // Update loading state when we've recovered data
  useEffect(() => {
    if (locationStateRecovered && location.state) {
      setIsLoading(false);
    }
  }, [locationStateRecovered, location.state]);
  
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
