
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MedicalSections } from '@/components/structured-output/types';

export const useStructuredOutputData = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // State for loading and processing indicators
  const [loading, setLoading] = useState<boolean>(true);
  const [processingText, setProcessingText] = useState<boolean>(false);
  
  // State for structured data
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [formattedVersions, setFormattedVersions] = useState<Array<{
    formatType: string;
    formattedText: string;
  }>>([]);
  const [activeFormatType, setActiveFormatType] = useState<string>('');
  
  // State for transcription data and error
  const [transcriptionData, setTranscriptionData] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Patient information
  const [patientInfo, setPatientInfo] = useState<{
    id: string | null;
    name: string | null;
  }>({
    id: null,
    name: null
  });
  
  // On mount, check if we have data in location state
  useEffect(() => {
    if (location.state) {
      // Set transcription data
      if (location.state.transcriptionData) {
        setTranscriptionData(location.state.transcriptionData);
      }
      
      // Set audio URL if available
      if (location.state.audioUrl) {
        setAudioUrl(location.state.audioUrl);
      }
      
      // Set transcription ID if available
      if (location.state.transcriptionId) {
        setTranscriptionId(location.state.transcriptionId);
      }
      
      // Set patient information if available
      if (location.state.patientId) {
        setPatientInfo(prev => ({
          ...prev,
          id: location.state.patientId
        }));
      }
      
      if (location.state.patientName) {
        setPatientInfo(prev => ({
          ...prev,
          name: location.state.patientName
        }));
      }
      
      // Set formatted versions if available
      if (location.state.formattedVersions && location.state.formattedVersions.length > 0) {
        setFormattedVersions(location.state.formattedVersions);
        
        // Set active format type to the first one
        setActiveFormatType(location.state.formattedVersions[0].formatType);
        
        // Convert first formatted text to structured data
        convertFormattedTextToData(location.state.formattedVersions[0].formattedText);
      }
      
      setLoading(false);
    } else {
      // If no location state, we're done loading but have no data
      setLoading(false);
      setError('No transcription data available');
    }
  }, [location]);
  
  // Function to convert formatted text to structured data
  const convertFormattedTextToData = (text: string) => {
    try {
      const sections: Record<string, string> = {};
      
      // Split by sections (# Section name)
      const sectionMatches = text.split(/^# /m).filter(Boolean);
      
      sectionMatches.forEach(section => {
        const lines = section.split('\n');
        if (lines.length > 0) {
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          
          // Convert title to camelCase for the key
          const key = title
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
              index === 0 ? letter.toLowerCase() : letter.toUpperCase()
            )
            .replace(/\s+/g, '');
          
          sections[key] = content;
        }
      });
      
      setStructuredData(sections as unknown as MedicalSections);
    } catch (error) {
      console.error('Error converting formatted text to structured data:', error);
      setError('Failed to parse formatted text');
    }
  };
  
  // Function to switch between formatted versions
  const switchFormatType = (formatType: string) => {
    const selectedVersion = formattedVersions.find(v => v.formatType === formatType);
    
    if (selectedVersion) {
      setActiveFormatType(formatType);
      convertFormattedTextToData(selectedVersion.formattedText);
    }
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
    switchFormatType,
    setLoading,
    setProcessingText,
    setError
  };
};
