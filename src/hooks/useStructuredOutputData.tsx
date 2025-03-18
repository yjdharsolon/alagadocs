
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';
import { MedicalSections } from '@/components/structured-output/types';

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

  // Generate different format types
  useEffect(() => {
    if (transcriptionData?.text && !noteId && !loading && !processingText) {
      const generateFormats = async () => {
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
            throw new Error('No structured formats could be generated');
          }
        } catch (error: any) {
          console.error('Error processing multiple formats:', error);
          setError(`Failed to structure the transcription: ${error.message}`);
          toast.error('Failed to structure the transcription');
        } finally {
          setProcessingText(false);
        }
      };
      
      generateFormats();
    }
  }, [transcriptionData, loading, processingText, noteId]);

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
    setFormattedVersions,
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats
  };
};
