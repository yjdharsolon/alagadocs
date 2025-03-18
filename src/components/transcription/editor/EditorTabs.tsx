
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, FileText } from 'lucide-react';
import EditorTextArea from './EditorTextArea';
import MedicalTranscriptionFormatter from '../MedicalTranscriptionFormatter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  onSaveFormatted: (text: string, formatType: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onContinueToStructured: () => void;
  saveSuccess?: boolean;
  saveError?: string | null;
}

const EditorTabs = ({
  activeTab,
  setActiveTab,
  transcriptionText,
  onTranscriptionChange,
  onSaveFormatted,
  isSaving,
  onSave,
  onContinueToStructured,
  saveSuccess,
  saveError
}: EditorTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
      <TabsList className="w-full grid grid-cols-2 border border-[#E0E0E0] p-1 rounded-md">
        <TabsTrigger 
          value="edit" 
          className="flex items-center gap-2 data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Text</span>
        </TabsTrigger>
        <TabsTrigger 
          value="format" 
          className="flex items-center gap-2 data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white"
        >
          <FileText className="h-4 w-4" />
          <span>Format</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit">
        {saveSuccess && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 shadow-sm">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Transcription saved successfully!
            </AlertDescription>
          </Alert>
        )}
        
        {saveError && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200 shadow-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {saveError}
            </AlertDescription>
          </Alert>
        )}
        
        <EditorTextArea 
          transcriptionText={transcriptionText}
          onTranscriptionChange={onTranscriptionChange}
        />
      </TabsContent>
      
      <TabsContent value="format">
        <MedicalTranscriptionFormatter 
          transcriptionText={transcriptionText}
          onSaveFormatted={onSaveFormatted}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
