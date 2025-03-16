
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EditorTabs from './editor/EditorTabs';
import EditorFooter from './editor/EditorFooter';

interface TranscriptionEditorProps {
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  onSave: () => void;
  onContinueToStructured: () => void;
  isSaving: boolean;
  saveError?: string | null;
  saveSuccess?: boolean;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({ 
  transcriptionText, 
  onTranscriptionChange, 
  onSave, 
  onContinueToStructured, 
  isSaving,
  saveError,
  saveSuccess
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [formattedText, setFormattedText] = useState('');
  
  const handleSaveFormatted = (text: string) => {
    setFormattedText(text);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Transcription</CardTitle>
        <CardDescription>
          Edit transcription text and format it for medical documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditorTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          transcriptionText={transcriptionText}
          onTranscriptionChange={onTranscriptionChange}
          saveSuccess={saveSuccess}
          saveError={saveError}
          onSaveFormatted={handleSaveFormatted}
          isSaving={isSaving}
          onSave={onSave}
          onContinueToStructured={onContinueToStructured}
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
        <EditorFooter
          activeTab={activeTab}
          onSave={onSave}
          onContinueToStructured={onContinueToStructured}
          setActiveTab={setActiveTab}
          isSaving={isSaving}
          transcriptionText={transcriptionText}
          formattedText={formattedText}
        />
      </CardFooter>
    </Card>
  );
};

export default TranscriptionEditor;
