
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';

export const useStructuredOutputData = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get data from location state
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;
  const patientInfo = {
    id: location.state?.patientId || null,
    name: location.state?.patientName || null
  };

  useEffect(() => {
    const processTranscription = async () => {
      if (!transcriptionData?.text) {
        setError('No transcription text available');
        setLoading(false);
        return;
      }

      try {
        setProcessingText(true);
        const structuredResult = await structureText(transcriptionData.text);
        
        if (structuredResult) {
          setStructuredData(structuredResult);
          toast.success('Medical notes structured successfully');
        } else {
          throw new Error('No structured data returned');
        }
      } catch (error: any) {
        console.error('Error processing transcription:', error);
        setError(`Failed to structure the transcription: ${error.message}`);
        toast.error('Failed to structure the transcription');
      } finally {
        setProcessingText(false);
        setLoading(false);
      }
    };

    if (location.state) {
      processTranscription();
    } else {
      setLoading(false);
      setError('No transcription data available');
    }
  }, [location.state, transcriptionData]);

  return {
    loading,
    processingText,
    structuredData,
    setStructuredData,
    error,
    patientInfo,
    transcriptionData,
    audioUrl,
    transcriptionId
  };
};
