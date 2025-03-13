
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  structureText, 
  saveStructuredNote, 
  getStructuredNote
} from '@/services/structuredTextService';
import { getUserTemplates } from '@/services/templateService';
import { StructuredNote, TextTemplate } from '@/components/structured-output/types';

interface UseStructuredOutputParams {
  transcriptionData: any;
  transcriptionId: string;
  audioUrl?: string;
}

export const useStructuredOutput = ({ 
  transcriptionData, 
  transcriptionId, 
  audioUrl 
}: UseStructuredOutputParams) => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [structuredData, setStructuredData] = useState<StructuredNote | null>(null);
  const [processingText, setProcessingText] = useState(false);
  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (user) {
        try {
          const userTemplates = await getUserTemplates(user.id);
          setTemplates(userTemplates);
          
          // Find default template if exists
          const defaultTemplate = userTemplates.find(t => t.isDefault);
          if (defaultTemplate) {
            setSelectedTemplateId(defaultTemplate.id);
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      }
    };
    
    fetchTemplates();
  }, [user]);
  
  useEffect(() => {
    const processTranscription = async () => {
      if (!transcriptionData || !transcriptionId) {
        console.error('Missing required data:', { transcriptionData, transcriptionId });
        setError('Missing transcription data. Please go back and try again.');
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.error('No authenticated user');
        setError('You must be logged in to view structured notes.');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Processing transcription:', { id: transcriptionId, text: transcriptionData.text?.substring(0, 50) + '...' });
        
        // First check if we already have structured data for this transcription
        const existingData = await getStructuredNote(transcriptionId);
        
        if (existingData?.content) {
          console.log('Found existing structured note');
          setStructuredData(existingData.content);
          setLoading(false);
          return;
        }
        
        setProcessingText(true);
        const userRole = await getUserRole();
        console.log('User role:', userRole);
        
        // Get selected template if exists
        let selectedTemplate = null;
        if (selectedTemplateId) {
          selectedTemplate = templates.find(t => t.id === selectedTemplateId) || null;
        }
        
        // Structure the text
        console.log('Structuring text with template:', selectedTemplate);
        const structuredResult = await structureText(
          transcriptionData.text, 
          userRole,
          selectedTemplate
        );
        
        if (structuredResult) {
          console.log('Structured result received:', structuredResult);
          setStructuredData(structuredResult);
          
          // Save to database
          await saveStructuredNote(user.id, transcriptionId, structuredResult);
          toast.success('Medical notes structured successfully');
        } else {
          throw new Error('No structured data returned');
        }
      } catch (error: any) {
        console.error('Error processing transcription:', error);
        setError(`Failed to structure the transcription: ${error.message}`);
        toast.error('Failed to structure the transcription. Please try again.');
      } finally {
        setProcessingText(false);
        setLoading(false);
      }
    };
    
    processTranscription();
  }, [transcriptionData, transcriptionId, user, getUserRole, templates, selectedTemplateId]);
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setLoading(true);
    setProcessingText(true);
    
    // Re-trigger the useEffect to reprocess with the new template
    const timer = setTimeout(() => {
      setLoading(false);
      setProcessingText(false);
    }, 3000); // Fallback timer
    
    return () => clearTimeout(timer);
  };
  
  const handleBackToTranscription = () => {
    navigate('/transcribe', { 
      state: { 
        transcriptionData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        structuredData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
  return {
    user,
    loading,
    processingText,
    structuredData,
    templates,
    error,
    handleBackToTranscription,
    handleTemplateSelect,
    handleEdit,
    navigate
  };
};
