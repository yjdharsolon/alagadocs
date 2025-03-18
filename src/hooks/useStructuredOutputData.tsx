
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';
import { MedicalSections } from '@/components/structured-output/types';
import { getStructuredNoteById } from '@/services/structuredNoteService';

export const useStructuredOutputData = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Store multiple format versions
  const [formattedVersions, setFormattedVersions] = useState<Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>>([]);
  
  const [activeFormatType, setActiveFormatType] = useState<string>('history');
  
  // Get data from location state
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;
  const statePatientId = location.state?.patientId;
  const statePatientName = location.state?.patientName;
  
  const transcriptionPatientId = transcriptionData?.patient_id;
  
  const [patientInfo, setPatientInfo] = useState<{id: string | null, name: string | null}>({
    id: null,
    name: null
  });

  // Initialize patient info from various sources
  useEffect(() => {
    if (statePatientId) {
      setPatientInfo({
        id: statePatientId,
        name: statePatientName || null
      });
      return;
    }
    
    if (transcriptionPatientId) {
      setPatientInfo({
        id: transcriptionPatientId,
        name: null
      });
      return;
    }
    
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patientData = JSON.parse(storedPatient);
        setPatientInfo({
          id: patientData.id,
          name: `${patientData.first_name} ${patientData.last_name}`
        });
      }
    } catch (error) {
      console.error('Error retrieving patient from sessionStorage:', error);
    }
  }, [statePatientId, statePatientName, transcriptionPatientId]);

  // Load data on component mount
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          setLoading(true);
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
            setStructuredData(note.content);
          } else {
            setError('Note not found');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          setError('Error loading note');
        } finally {
          setLoading(false);
        }
      } else if (location.state?.structuredData) {
        setStructuredData(location.state.structuredData);
        setLoading(false);
      } else if (transcriptionData && transcriptionData.text) {
        // Just mark as not loading - processTranscription will be called separately
        setLoading(false);
      } else {
        setLoading(false);
        setError('No transcription data found');
      }
    };

    loadNote();
  }, [noteId, location.state, transcriptionData]);

  // Initialize format generation if we have transcription data but no formats yet
  useEffect(() => {
    // Only process if we have transcription data, aren't already processing,
    // don't have a noteId (which would load from DB), and don't have formats yet
    if (
      transcriptionData?.text && 
      !processingText && 
      !noteId && 
      formattedVersions.length === 0 &&
      !loading
    ) {
      generateFormats();
    }
  }, [transcriptionData, processingText, noteId, formattedVersions.length, loading]);

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
        { id: 'prescription', name: 'Prescription' }
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
        setActiveFormatType(defaultFormat.formatType);
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

  // Handle format type change
  const handleFormatTypeChange = (formatType: string) => {
    setActiveFormatType(formatType);
    const selectedFormat = formattedVersions.find(f => f.formatType === formatType);
    if (selectedFormat) {
      setStructuredData(selectedFormat.structuredData);
    }
  };

  // Toggle selection of a format
  const toggleFormatSelection = (formatType: string) => {
    setFormattedVersions(prev => 
      prev.map(format => 
        format.formatType === formatType 
          ? { ...format, selected: !format.selected } 
          : format
      )
    );
  };

  // Get only the selected formats
  const getSelectedFormats = () => {
    return formattedVersions.filter(format => format.selected);
  };

  return {
    loading,
    processingText,
    structuredData,
    setStructuredData,
    error,
    patientInfo,
    transcriptionData,
    audioUrl,
    transcriptionId,
    formattedVersions,
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats
  };
};
