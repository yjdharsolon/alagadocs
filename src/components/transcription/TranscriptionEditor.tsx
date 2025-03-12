
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalTranscriptionFormatter from './MedicalTranscriptionFormatter';

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
  const [activeTab, setActiveTab] = useState('edit');
  const [formattedText, setFormattedText] = useState('');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onTranscriptionChange(newText);
    setWordCount(countWords(newText));
  };
  
  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  const handleSaveFormatted = (text: string) => {
    setFormattedText(text);
    // You can add logic here to save the formatted text to your database
    // or pass it back to a parent component
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Transcription</TabsTrigger>
            <TabsTrigger value="format">Format as Medical Note</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="pt-4">
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
            
            <Textarea 
              className="min-h-[400px] font-mono text-sm"
              value={transcriptionText}
              onChange={handleTextChange}
              placeholder="Your transcription text will appear here for editing..."
            />
            
            <div className="text-sm text-muted-foreground mt-2">
              Word count: {wordCount}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={onSave}
                disabled={isSaving || !transcriptionText.trim()}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => setActiveTab('format')}
                disabled={!transcriptionText.trim()}
              >
                <FileText className="mr-2 h-4 w-4" />
                Format as Medical Note
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="format" className="pt-4">
            <MedicalTranscriptionFormatter
              transcriptionText={transcriptionText}
              onSaveFormatted={handleSaveFormatted}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        {activeTab === 'format' && formattedText && (
          <Button 
            onClick={onContinueToStructured}
            disabled={!formattedText.trim()}
          >
            <FileText className="mr-2 h-4 w-4" />
            Continue to Structuring
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TranscriptionEditor;
