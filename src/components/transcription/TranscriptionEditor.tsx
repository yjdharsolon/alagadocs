
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalTranscriptionFormatter from './MedicalTranscriptionFormatter';
import { FixedSizeList as List } from 'react-window';

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
  
  // Memoize expensive calculations
  const wordCount = useMemo(() => countWords(transcriptionText), [transcriptionText]);
  
  const lines = useMemo(() => {
    if (!transcriptionText) return [];
    return transcriptionText.split('\n');
  }, [transcriptionText]);
  
  const isLargeContent = lines.length > 200;
  
  // Optimize event handlers with useCallback
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTranscriptionChange(e.target.value);
  }, [onTranscriptionChange]);
  
  const handleSaveFormatted = useCallback((text: string) => {
    setFormattedText(text);
  }, []);
  
  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  // Render optimized view for large content
  const renderOptimizedTextarea = () => {
    return (
      <div className="space-y-2">
        <div className="border rounded-md">
          <List
            height={300}
            itemCount={lines.length}
            itemSize={20}
            width="100%"
            className="bg-background text-sm font-mono overflow-x-auto"
          >
            {({ index, style }) => (
              <div style={style} className="px-3 py-0.5">
                {lines[index]}
              </div>
            )}
          </List>
        </div>
        <Textarea 
          className="min-h-[100px] font-mono text-sm"
          value={transcriptionText}
          onChange={handleTextChange}
          placeholder="Your transcription text will appear here for editing..."
          aria-label="Transcription text editor"
        />
      </div>
    );
  };
  
  // Standard rendering for smaller content
  const renderStandardTextarea = () => (
    <Textarea 
      className="min-h-[300px] sm:min-h-[400px] font-mono text-sm resize-none"
      value={transcriptionText}
      onChange={handleTextChange}
      placeholder="Your transcription text will appear here for editing..."
      aria-label="Transcription text editor"
    />
  );
  
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="edit" className="text-xs sm:text-sm md:text-base px-1 truncate">
              Edit Transcription
            </TabsTrigger>
            <TabsTrigger value="format" className="text-xs sm:text-sm md:text-base px-1 truncate">
              Format Note
            </TabsTrigger>
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
            
            {isLargeContent ? renderOptimizedTextarea() : renderStandardTextarea()}
            
            <div className="text-sm text-muted-foreground mt-2">
              Word count: {wordCount}
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
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
        {activeTab === 'edit' ? (
          <>
            <Button 
              variant="outline" 
              onClick={onSave}
              disabled={isSaving || !transcriptionText.trim()}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={() => setActiveTab('format')}
              disabled={!transcriptionText.trim()}
              className="w-full sm:w-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              Format Note
            </Button>
          </>
        ) : (
          <Button 
            onClick={onContinueToStructured}
            disabled={!formattedText.trim() && !transcriptionText.trim()}
            className="ml-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            Continue to Structuring
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TranscriptionEditor;
