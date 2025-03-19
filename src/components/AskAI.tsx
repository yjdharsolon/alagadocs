import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { structureTranscription, saveStructuredNote } from '@/services/structuredOutputService';
import { MedicalSections } from '@/components/structured-output/types';

const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [queryType, setQueryType] = useState('general');
  const [role, setRole] = useState('Doctor');
  const [structuredOutput, setStructuredOutput] = useState<MedicalSections | null>(null);
  const [customTemplate, setCustomTemplate] = useState<{ sections: string[] } | undefined>(undefined);

  const predefinedTemplates = [
    { id: 'standard', name: 'Standard Medical Note', sections: [] },
    { id: 'soap', name: 'SOAP Note', sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] },
    { id: 'history', name: 'History & Physical', sections: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Social History', 'Family History', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'] },
    { id: 'progress', name: 'Progress Note', sections: ['Subjective', 'Objective', 'Medication Review', 'Assessment', 'Plan'] }
  ];
  
  const [selectedTemplate, setSelectedTemplate] = useState('standard');

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleSaveStructuredNote = async () => {
    if (!structuredOutput) return;
    
    try {
      setIsSaving(true);
      const tempTranscriptionId = 'temp-' + Date.now().toString();
      const { id } = await saveStructuredNote(structuredOutput, tempTranscriptionId);
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8">
      <Tabs defaultValue="general" onValueChange={(value) => setQueryType(value)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general">General Questions</TabsTrigger>
          <TabsTrigger value="structure">Structure Medical Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <h2 className="text-2xl font-bold mb-4">Ask AI Assistant</h2>
          <p className="text-muted-foreground mb-6">
            Ask medical questions or get help with clinical information.
          </p>
        </TabsContent>
        
        <TabsContent value="structure">
          <h2 className="text-2xl font-bold mb-4">Structure Medical Text</h2>
          <p className="text-muted-foreground mb-6">
            Convert raw medical text into a structured clinical note format.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select your role
              </label>
              <Select
                value={role}
                onValueChange={setRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Medical Assistant">Medical Assistant</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Medical Student">Medical Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Select template
              </label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      
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
      </Tabs>
      
      {response && queryType === 'general' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Response:</h3>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
      
      {structuredOutput && queryType === 'structure' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Structured Output:</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveStructuredNote}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Save className="mr-2 h-3 w-3" />
              )}
              Save Note
            </Button>
          </div>
          <div className="space-y-4">
            {Object.entries(structuredOutput).map(([key, value]) => (
              <div key={key} className="border rounded-md p-4 bg-white">
                <h4 className="font-medium capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm whitespace-pre-wrap">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AskAI;
