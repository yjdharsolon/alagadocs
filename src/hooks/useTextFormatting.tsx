
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTextFormattingProps {
  transcriptionText: string;
}

export const useTextFormatting = ({ transcriptionText }: UseTextFormattingProps) => {
  const [formattedText, setFormattedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<string>('soap');
  
  const formatTypes = [
    { id: 'soap', name: 'SOAP Note' },
    { id: 'clinical', name: 'Clinical Progress Note' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'discharge', name: 'Discharge Summary' },
    { id: 'history', name: 'History & Physical' }
  ];
  
  const getTemplateSections = (type: string): string[] => {
    switch (type) {
      case 'soap':
        return ['Subjective', 'Objective', 'Assessment', 'Plan'];
      case 'clinical':
        return ['Chief Complaint', 'History of Present Illness', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'];
      case 'consultation':
        return ['Reason for Consultation', 'History', 'Findings', 'Impression', 'Recommendations'];
      case 'discharge':
        return ['Admission Date', 'Discharge Date', 'Discharge Diagnosis', 'Hospital Course', 'Discharge Medications', 'Follow-up Instructions'];
      case 'history':
        return ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Social History', 'Family History', 'Allergies', 'Medications', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'];
      default:
        return ['Subjective', 'Objective', 'Assessment', 'Plan'];
    }
  };
  
  const restructureText = async () => {
    if (!transcriptionText.trim()) {
      setFormatError('No transcription text available to format');
      return;
    }
    
    try {
      setIsProcessing(true);
      setFormatError(null);
      
      // Call the OpenAI API through our Supabase edge function
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
      
      // If the response is already in JSON format
      if (typeof data === 'object') {
        // Format the structured data into text
        const formattedContent = Object.entries(data)
          .map(([key, value]) => {
            // Convert camelCase to Title Case (e.g., chiefComplaint → Chief Complaint)
            const title = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
              
            return `# ${title}\n${value}`;
          })
          .join('\n\n');
        
        setFormattedText(formattedContent);
      } else if (data?.content) {
        // If data has content property
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
