
import React from 'react';
import Layout from '@/components/Layout';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { useTranscriptionRecovery } from '@/hooks/useTranscriptionRecovery';
import { useTranscriptionNavigation } from '@/hooks/useTranscriptionNavigation';
import { usePatientContext } from '@/hooks/usePatientContext';
import { useAuth } from '@/hooks/useAuth';
import EditStep from '@/components/transcription/EditStep';
import LoadingTranscription from '@/components/transcription/LoadingTranscription';
import PendingTranscription from '@/components/transcription/PendingTranscription';
import TranscriptionError from '@/components/transcription/TranscriptionError';
import PatientInfoCard from '@/components/transcription/PatientInfoCard';

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
  
  // Get patient information from location state or session storage
  const patientInfo = usePatientContext(location.state?.patientId, location.state?.patientName);
  
  // Navigation utilities
  const { redirectToUpload } = useTranscriptionNavigation();
  
  // Authentication check
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (isPending) {
      const interval = setInterval(checkTranscriptionStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [isPending, checkTranscriptionStatus]);
  
  // Check for recovery scenarios and handle redirections
  React.useEffect(() => {
    // Handle pending cases
    if (location.state?.isPending) {
      console.log('Detected pending transcription state');
      setIsPending(true);
      setIsLoading(false);
      return;
    }
    
    // Handle completed transcription
    if (location.state && location.state.transcriptionData) {
      console.log('Found complete transcription data in location state');
      setIsLoading(false);
      return;
    }
    
    // Check URL parameters for pending status
    const urlParams = new URLSearchParams(window.location.search);
    const isPendingParam = urlParams.get('pending');
    
    if (isPendingParam === 'true') {
      handlePendingParam();
      return;
    }
    
    // If no location state, try to recover from session storage
    if (!location.state) {
      const recovered = recoverFromSessionStorage();
      
      // If recovery failed and we're not pending, redirect to upload
      if (!recovered && !isPending && recoveryAttempted) {
        redirectToUpload();
      }
    } else {
      setIsLoading(false);
    }
  }, [location.state, isPending, recoveryAttempted, setIsPending, setIsLoading, recoverFromSessionStorage, redirectToUpload]);
  
  // Clean up URL parameters
  const handlePendingParam = () => {
    console.log('Detected pending param in URL');
    try {
      const pendingTranscription = sessionStorage.getItem('pendingTranscription');
      if (pendingTranscription) {
        console.log('Found pending transcription in sessionStorage');
        setIsPending(true);
        setIsLoading(false);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, '/edit-transcript');
      }
    } catch (pendingErr) {
      console.error('Error checking pending transcription:', pendingErr);
    }
  };
  
  // Update loading state when we've recovered data
  React.useEffect(() => {
    if (locationStateRecovered && location.state) {
      setIsLoading(false);
    } else if (recoveryAttempted && !locationStateRecovered && !location.state && !isPending) {
      // If we tried recovery but failed and still don't have state, redirect
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

        <PatientInfoCard 
          patientName={patientInfo.name} 
          patientId={patientInfo.id} 
        />

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
