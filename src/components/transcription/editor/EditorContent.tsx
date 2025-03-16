
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import EditorTextArea from './EditorTextArea';
import { countWords } from './utils';

interface EditorContentProps {
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  saveSuccess?: boolean;
  saveError?: string | null;
}

const EditorContent: React.FC<EditorContentProps> = ({
  transcriptionText,
  onTranscriptionChange,
  saveSuccess,
  saveError
}) => {
  const wordCount = countWords(transcriptionText);

  return (
    <div className="space-y-4">
      {saveSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Transcription saved successfully
          </AlertDescription>
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {saveError}
          </AlertDescription>
        </Alert>
      )}
      
      <EditorTextArea 
        transcriptionText={transcriptionText}
        onTranscriptionChange={onTranscriptionChange}
      />
      
      <div className="text-sm text-muted-foreground mt-2">
        Word count: {wordCount}
      </div>
    </div>
  );
};

export default EditorContent;
