
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [wordCount, setWordCount] = useState(countWords(transcriptionText));
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onTranscriptionChange(newText);
    setWordCount(countWords(newText));
  };
  
  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Transcription</CardTitle>
        <CardDescription>
          Make any corrections needed to the transcribed text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {saveSuccess && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Transcription saved successfully
            </AlertDescription>
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {saveError}
            </AlertDescription>
          </Alert>
        )}
        
        <Textarea 
          className="min-h-[400px] font-mono text-sm"
          value={transcriptionText}
          onChange={handleTextChange}
          placeholder="Your transcription text will appear here for editing..."
        />
        
        <div className="text-sm text-muted-foreground">
          Word count: {wordCount}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={onSave}
          disabled={isSaving || !transcriptionText.trim()}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          onClick={onContinueToStructured}
          disabled={!transcriptionText.trim()}
        >
          <FileText className="mr-2 h-4 w-4" />
          Continue to Structuring
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranscriptionEditor;
