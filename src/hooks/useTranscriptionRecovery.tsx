
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTranscriptionRecovery = () => {
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

  // Recover data from session storage
  const recoverFromSessionStorage = useCallback(() => {
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
        return true;
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
        return true;
      } else {
        console.log('No saved transcription data found');
        return false;
      }
    } catch (err) {
      console.error('Error recovering transcription data:', err);
      return false;
    }
  }, [navigate]);

  return {
    isLoading,
    setIsLoading,
    isPending,
    setIsPending,
    locationStateRecovered,
    setLocationStateRecovered,
    recoveryAttempted,
    setRecoveryAttempted,
    pendingData,
    setPendingData,
    checkTranscriptionStatus,
    recoverFromSessionStorage,
    location,
    navigate
  };
};
