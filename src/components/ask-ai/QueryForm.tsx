
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { structureTranscription } from '@/services/structuredOutputService';
import { MedicalSections } from '@/components/structured-output/types';

interface QueryFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryType: string;
  role: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>;
  setStructuredOutput: React.Dispatch<React.SetStateAction<MedicalSections | null>>;
  selectedTemplate: string;
}

const QueryForm: React.FC<QueryFormProps> = ({
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
  queryType,
  role,
  setResponse,
  setStructuredOutput,
  selectedTemplate
}) => {
  const predefinedTemplates = [
    { id: 'standard', name: 'Standard Medical Note', sections: [] },
    { id: 'soap', name: 'SOAP Note', sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] },
    { id: 'history', name: 'History & Physical', sections: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Social History', 'Family History', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'] },
    { id: 'progress', name: 'Progress Note', sections: ['Subjective', 'Objective', 'Medication Review', 'Assessment', 'Plan'] }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    setStructuredOutput(null);
    
    try {
      if (queryType === 'general') {
        const { data, error } = await supabase.functions.invoke('openai-chat', {
          body: { prompt: prompt.trim() }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setResponse(data.message);
        toast.success('Response received!');
      } else if (queryType === 'structure') {
        const template = selectedTemplate !== 'standard' 
          ? { sections: predefinedTemplates.find(t => t.id === selectedTemplate)?.sections || [] }
          : undefined;
          
        const result = await structureTranscription(prompt.trim(), role, template);
        setStructuredOutput(result);
        toast.success('Medical text structured successfully!');
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label htmlFor="prompt" className="block mb-2 text-sm font-medium">
          {queryType === 'general' ? 'Your question or prompt' : 'Enter medical text to structure'}
        </label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={queryType === 'general' 
            ? "Ask me anything about medicine..."
            : "Paste your medical text here to structure it into sections..."}
          className="min-h-32"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !prompt.trim()}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {queryType === 'general' ? 'Processing...' : 'Structuring...'}
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            {queryType === 'general' ? 'Ask AI' : 'Structure Text'}
          </>
        )}
      </Button>
    </form>
  );
};

export default QueryForm;
