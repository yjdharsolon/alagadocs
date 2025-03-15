
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { useTranscriptionRecovery } from '@/hooks/useTranscriptionRecovery';
import EditStep from '@/components/transcription/EditStep';
import LoadingTranscription from '@/components/transcription/LoadingTranscription';
import PendingTranscription from '@/components/transcription/PendingTranscription';
import TranscriptionError from '@/components/transcription/TranscriptionError';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { UserRound } from 'lucide-react';

export default function EditTranscriptPage() {
  const { user } = useAuth();
  const {
    isLoading,
    setIsLoading,
    isPending,
    setIsPending,
    locationStateRecovered,
    recoveryAttempted,
    checkTranscriptionStatus,
    recoverFromSessionStorage,
    location,
    navigate
  } = useTranscriptionRecovery();
  
  // Extract patient information
  const patientId = location.state?.patientId;
  const patientName = location.state?.patientName;
  
  // State for fallback patient info
  const [displayPatientInfo, setDisplayPatientInfo] = useState<{
    id: string | null,
    name: string | null
  }>({
    id: patientId || null,
    name: patientName || null
  });
  
  // Try to get patient info from session storage if not in location state
  useEffect(() => {
    if (!patientId) {
      try {
        const storedPatient = sessionStorage.getItem('selectedPatient');
        if (storedPatient) {
          const patientData = JSON.parse(storedPatient);
          setDisplayPatientInfo({
            id: patientData.id,
            name: `${patientData.first_name} ${patientData.last_name}`
          });
        }
      } catch (error) {
        console.error('Error retrieving patient from sessionStorage:', error);
      }
    }
  }, [patientId]);
  
  // Verify authentication first to prevent unwanted redirects
  useEffect(() => {
    // Check if we're in a redirect preservation state
    const preserveRedirect = sessionStorage.getItem('preserveAuthRedirect');
    
    if (!user && !preserveRedirect) {
      console.log('No authenticated user, redirecting to login');
      navigate('/login');
    } else if (preserveRedirect) {
      // Clear the preservation flag
      sessionStorage.removeItem('preserveAuthRedirect');
    }
  }, [user, navigate]);
  
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
      setIsLoading(false);
      return;
    }
    
    // If we have complete transcription data
    if (location.state && location.state.transcriptionData) {
      console.log('Found complete transcription data in location state');
      setIsLoading(false);
      return;
    }
    
    // Check URL parameters that might indicate pending status
    const urlParams = new URLSearchParams(window.location.search);
    const isPendingParam = urlParams.get('pending');
    
    if (isPendingParam === 'true') {
      console.log('Detected pending param in URL');
      try {
        const pendingTranscription = sessionStorage.getItem('pendingTranscription');
        if (pendingTranscription) {
          console.log('Found pending transcription in sessionStorage');
          setIsPending(true);
          setIsLoading(false);
          
          // Clean up the URL
          window.history.replaceState({}, document.title, '/edit-transcript');
          return;
        }
      } catch (pendingErr) {
        console.error('Error checking pending transcription:', pendingErr);
      }
    }
    
    // If no location state, try to recover from session storage
    if (!location.state) {
      const recovered = recoverFromSessionStorage();
      
      // If recovery failed and we're not pending, redirect to upload
      if (!recovered && !isPending && recoveryAttempted) {
        toast.error('No transcription data found');
        setTimeout(() => navigate('/upload'), 1500);
      }
    } else {
      setIsLoading(false);
    }
  }, [location.state, navigate, isPending, recoveryAttempted, setIsPending, setIsLoading, recoverFromSessionStorage]);
  
  // Update loading state when we've recovered data
  useEffect(() => {
    if (locationStateRecovered && location.state) {
      setIsLoading(false);
    } else if (recoveryAttempted && !locationStateRecovered && !location.state && !isPending) {
      // If we tried recovery but failed and still don't have state, redirect
      // but only if we're not in a pending state
      navigate('/upload');
    }
  }, [locationStateRecovered, location.state, recoveryAttempted, navigate, isPending, setIsLoading]);
  
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
    return <LoadingTranscription />;
  }

  // Render pending transcription state with skeleton UI
  if (isPending) {
    return <PendingTranscription />;
  }

  // Render error state when no transcription is found
  if (!transcriptionText && !isPending) {
    return <TranscriptionError />;
  }

  // Render normal edit view when transcription is available
  return (
    <Layout>
      <div className="container mx-auto py-10 pt-24">
        <h1 className="text-3xl font-bold mb-2">Edit Transcript</h1>
        <p className="text-muted-foreground mb-6">
          Review and edit your transcription
        </p>

        {displayPatientInfo.name && (
          <Card className="mb-6 border-green-100 shadow-sm">
            <CardContent className="py-3 flex items-center">
              <UserRound className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Patient: {displayPatientInfo.name}</p>
                {displayPatientInfo.id && (
                  <p className="text-xs text-muted-foreground">ID: {displayPatientInfo.id}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
};
