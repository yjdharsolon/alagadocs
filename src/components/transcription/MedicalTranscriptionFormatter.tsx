
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Wand2, Save, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface MedicalTranscriptionFormatterProps {
  transcriptionText: string;
  onSaveFormatted: (formattedText: string) => void;
}

const MedicalTranscriptionFormatter: React.FC<MedicalTranscriptionFormatterProps> = ({
  transcriptionText,
  onSaveFormatted
}) => {
  const [formattedText, setFormattedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<string>('soap');
  
  const formatTypes = [
    { id: 'soap', name: 'SOAP Note' },
    { id: 'clinical', name: 'Clinical Progress Note' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'discharge', name: 'Discharge Summary' },
    { id: 'history', name: 'History & Physical' }
  ];
  
  const restructureText = async () => {
    if (!transcriptionText.trim()) {
      setFormatError('No transcription text available to format');
      return;
    }
    
    try {
      setIsProcessing(true);
      setFormatError(null);
      
      // Call the OpenAI API through our Supabase edge function
      const { data, error } = await supabase.functions.invoke('openai-structure-text', {
        body: {
          text: transcriptionText,
          role: 'Doctor',
          template: {
            sections: getTemplateSections(formatType)
          }
        }
      });
      
      if (error) {
        throw new Error(`Error invoking edge function: ${error.message}`);
      }
      
      // If the response is already in JSON format
      if (typeof data === 'object') {
        // Format the structured data into text
        const formattedContent = Object.entries(data)
          .map(([key, value]) => {
            // Convert camelCase to Title Case (e.g., chiefComplaint → Chief Complaint)
            const title = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
              
            return `# ${title}\n${value}`;
          })
          .join('\n\n');
        
        setFormattedText(formattedContent);
      } else if (data?.content) {
        // If data has content property
        setFormattedText(data.content);
      } else {
        setFormattedText('No structured data returned from the API');
      }
    } catch (err) {
      console.error('Error restructuring text:', err);
      setFormatError(err instanceof Error ? err.message : 'Failed to restructure text');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getTemplateSections = (type: string): string[] => {
    switch (type) {
      case 'soap':
        return ['Subjective', 'Objective', 'Assessment', 'Plan'];
      case 'clinical':
        return ['Chief Complaint', 'History of Present Illness', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'];
      case 'consultation':
        return ['Reason for Consultation', 'History', 'Findings', 'Impression', 'Recommendations'];
      case 'discharge':
        return ['Admission Date', 'Discharge Date', 'Discharge Diagnosis', 'Hospital Course', 'Discharge Medications', 'Follow-up Instructions'];
      case 'history':
        return ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Social History', 'Family History', 'Allergies', 'Medications', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'];
      default:
        return ['Subjective', 'Objective', 'Assessment', 'Plan'];
    }
  };
  
  const handleSave = () => {
    if (formattedText.trim()) {
      onSaveFormatted(formattedText);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-md font-medium">Format Type</Label>
        <Select
          value={formatType}
          onValueChange={setFormatType}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select format type" />
          </SelectTrigger>
          <SelectContent>
            {formatTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Format Medical Transcription</CardTitle>
          <CardDescription>
            Transform your raw transcription into a structured medical document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formatError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {formatError}
              </AlertDescription>
            </Alert>
          )}
          
          {isProcessing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">AI is structuring your medical text...</p>
              </div>
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <Textarea 
              className="min-h-[300px] font-mono text-sm"
              value={formattedText}
              onChange={(e) => setFormattedText(e.target.value)}
              placeholder="Structured medical text will appear here..."
              readOnly={isProcessing}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isProcessing || !formattedText.trim()}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Formatted Text
          </Button>
          <Button 
            onClick={restructureText}
            disabled={isProcessing || !transcriptionText.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Format with AI
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MedicalTranscriptionFormatter;
