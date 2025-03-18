import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTextFormattingProps {
  transcriptionText: string;
}

export const useTextFormatting = ({ transcriptionText }: UseTextFormattingProps) => {
  const [formattedText, setFormattedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<string>('history');
  
  const formatTypes = [
    { id: 'history', name: 'History & Physical' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'prescription', name: 'Prescription' }
  ];
  
  const getTemplateSections = (type: string): string[] => {
    switch (type) {
      case 'prescription':
        return ['Patient Information', 'Medications', 'Prescriber Information'];
      case 'history':
        return ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Physical Examination', 'Assessment', 'Plan'];
      case 'consultation':
        return ['Reason for Consultation', 'History', 'Findings', 'Impression', 'Recommendations'];
      default:
        return ['Chief Complaint', 'History', 'Assessment', 'Plan'];
    }
  };
  
  useEffect(() => {
    if (transcriptionText && formatType) {
      restructureText();
    }
  }, [formatType]);
  
  const restructureText = async () => {
    if (!transcriptionText.trim()) {
      setFormatError('No transcription text available to format');
      return;
    }
    
    try {
      setIsProcessing(true);
      setFormatError(null);
      
      const { data, error } = await supabase.functions.invoke('openai-structure-text', {
        body: {
          text: transcriptionText,
          role: 'Doctor',
          template: {
            sections: getTemplateSections(formatType)
          }
        }
      });
      
      if (error) {
        throw new Error(`Error invoking edge function: ${error.message}`);
      }
      
      if (typeof data === 'object') {
        const formattedContent = Object.entries(data)
          .map(([key, value]) => {
            const title = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
              
            return `# ${title}\n${value}`;
          })
          .join('\n\n');
        
        setFormattedText(formattedContent);
      } else if (data?.content) {
        setFormattedText(data.content);
      } else {
        setFormattedText('No structured data returned from the API');
      }
    } catch (err) {
      console.error('Error restructuring text:', err);
      setFormatError(err instanceof Error ? err.message : 'Failed to restructure text');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    formattedText,
    setFormattedText,
    isProcessing,
    formatError,
    formatType,
    setFormatType,
    formatTypes,
    restructureText
  };
};
