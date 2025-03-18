
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Transcription</CardTitle>
        <CardDescription>
          Edit transcription text before structuring it for medical documentation
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
          isSaving={isSaving}
          onSave={onSave}
          onContinueToStructured={onContinueToStructured}
        />
      </CardContent>
      <CardFooter>
        <EditorFooter
          onSave={onSave}
          onContinueToStructured={onContinueToStructured}
          isSaving={isSaving}
          transcriptionText={transcriptionText}
        />
      </CardFooter>
    </Card>
  );
};

export default TranscriptionEditor;
