
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditorContent from './EditorContent';
import MedicalTranscriptionFormatter from '../MedicalTranscriptionFormatter';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  saveSuccess?: boolean;
  saveError?: string | null;
  onSaveFormatted: (text: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onContinueToStructured: () => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  activeTab,
  setActiveTab,
  transcriptionText,
  onTranscriptionChange,
  saveSuccess,
  saveError,
  onSaveFormatted,
  isSaving,
  onSave,
  onContinueToStructured
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="edit" className="text-xs sm:text-sm md:text-base px-1 truncate">
          Edit Transcription
        </TabsTrigger>
        <TabsTrigger value="format" className="text-xs sm:text-sm md:text-base px-1 truncate">
          Format Note
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit" className="pt-4">
        <EditorContent
          transcriptionText={transcriptionText}
          onTranscriptionChange={onTranscriptionChange}
          saveSuccess={saveSuccess}
          saveError={saveError}
        />
      </TabsContent>
      
      <TabsContent value="format" className="pt-4">
        <MedicalTranscriptionFormatter
          transcriptionText={transcriptionText}
          onSaveFormatted={onSaveFormatted}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
