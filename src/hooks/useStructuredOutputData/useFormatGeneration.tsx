
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';

interface UseFormatGenerationProps {
  transcriptionData: any;
  processingText: boolean;
  setProcessingText: (value: boolean) => void;
  structuredData: MedicalSections | null;
  setStructuredData: (data: MedicalSections) => void;
  setError: (error: string | null) => void;
  loading: boolean;
  noteId: string | null;
  setLoading: (loading: boolean) => void;
}

export const useFormatGeneration = ({
  transcriptionData,
  processingText,
  setProcessingText,
  structuredData,
  setStructuredData,
  setError,
  loading,
  noteId,
  setLoading
}: UseFormatGenerationProps) => {
  const [formattedVersions, setFormattedVersions] = useState<Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>>([]);

  // Process transcription data
  const processTranscription = async () => {
    if (!transcriptionData || !transcriptionData.text) {
      setError('Missing transcription text');
      setLoading(false);
      return;
    }
    
    try {
      setProcessingText(true);
      console.log('Processing transcription:', transcriptionData.text);
      
      const structuredResult = await structureText(transcriptionData.text);
      
      if (structuredResult) {
        console.log('Structured result received:', structuredResult);
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

  // Generate different format types
  const generateFormats = async () => {
    if (!transcriptionData?.text) {
      setError('Missing transcription text');
      return;
    }

    setProcessingText(true);
    
    try {
      const formatTypes = [
        { id: 'history', name: 'History & Physical' },
        { id: 'consultation', name: 'Consultation' },
        { id: 'prescription', name: 'Prescription' },
        { id: 'soap', name: 'SOAP Note' }
      ];
      
      const formattedResults = [];
      
      for (const formatType of formatTypes) {
        try {
          console.log(`Generating ${formatType.name} format...`);
          const structuredResult = await structureText(transcriptionData.text, formatType.id);
          
          if (structuredResult) {
            // Format the text representation
            const formattedText = Object.entries(structuredResult)
              .map(([key, value]) => {
                const title = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return `# ${title}\n${value}`;
              })
              .join('\n\n');
              
            formattedResults.push({
              formatType: formatType.id,
              formattedText,
              structuredData: structuredResult,
              selected: formatType.id === 'history' // Select history format by default
            });
          }
        } catch (err) {
          console.error(`Error generating ${formatType.name} format:`, err);
        }
      }
      
      if (formattedResults.length > 0) {
        setFormattedVersions(formattedResults);
        
        // Set the first format as the active one
        const defaultFormat = formattedResults.find(f => f.formatType === 'history') || formattedResults[0];
        setStructuredData(defaultFormat.structuredData);
        
        toast.success('Multiple format types generated successfully');
      } else {
        // If all format generations failed, try a basic structure instead
        await processTranscription();
        
        if (!structuredData) {
          setError('No structured formats could be generated');
          toast.error('Failed to generate formatted versions');
        }
      }
    } catch (error: any) {
      console.error('Error processing multiple formats:', error);
      setError(`Failed to structure the transcription: ${error.message}`);
      toast.error('Failed to structure the transcription');
      
      // Attempt to process as a single format as fallback
      await processTranscription();
    } finally {
      setProcessingText(false);
    }
  };

  // Initialize format generation if we have transcription data but no formats yet
  if (
    transcriptionData?.text && 
    !processingText && 
    !noteId && 
    formattedVersions.length === 0 &&
    !loading &&
    typeof window !== 'undefined'
  ) {
    generateFormats();
  }

  return {
    formattedVersions,
    setFormattedVersions,
    generateFormats,
    processTranscription
  };
};
