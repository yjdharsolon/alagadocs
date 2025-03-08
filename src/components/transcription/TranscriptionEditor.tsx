
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText } from 'lucide-react';

interface TranscriptionEditorProps {
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  onSave: () => void;
  onContinueToStructured: () => void;
  isSaving: boolean;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({ 
  transcriptionText, 
  onTranscriptionChange, 
  onSave, 
  onContinueToStructured, 
  isSaving 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Transcription</CardTitle>
        <CardDescription>
          Make any corrections needed to the transcribed text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          className="min-h-[400px] font-mono text-sm"
          value={transcriptionText}
          onChange={(e) => onTranscriptionChange(e.target.value)}
          placeholder="Your transcription text will appear here for editing..."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
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
