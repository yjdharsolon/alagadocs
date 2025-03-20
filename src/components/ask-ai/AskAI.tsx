
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QueryForm from './QueryForm';
import GeneralTabContent from './GeneralTabContent';
import StructureTabContent from './StructureTabContent';
import AIResponse from './AIResponse';
import StructuredOutput from './StructuredOutput';
import { MedicalSections } from '@/components/structured-output/types';

/**
 * The main AskAI component that allows users to interact with AI
 * for general questions or structuring medical text.
 */
const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [queryType, setQueryType] = useState('general');
  const [role, setRole] = useState('Doctor');
  const [structuredOutput, setStructuredOutput] = useState<MedicalSections | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8">
      <Tabs defaultValue="general" onValueChange={(value) => setQueryType(value)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general">General Questions</TabsTrigger>
          <TabsTrigger value="structure">Structure Medical Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralTabContent />
        </TabsContent>
        
        <TabsContent value="structure">
          <StructureTabContent 
            role={role}
            setRole={setRole}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </TabsContent>
      
        <QueryForm
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          queryType={queryType}
          role={role}
          setResponse={setResponse}
          setStructuredOutput={setStructuredOutput}
          selectedTemplate={selectedTemplate}
        />
      </Tabs>
      
      {response && queryType === 'general' && (
        <AIResponse response={response} />
      )}
      
      {structuredOutput && queryType === 'structure' && (
        <StructuredOutput 
          structuredOutput={structuredOutput} 
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}
    </Card>
  );
};

export default AskAI;
