
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import FormatTypeSelector from './FormatTypeSelector';
import FormattedTextEditor from './FormattedTextEditor';
import FormatActionButtons from './FormatActionButtons';
import { useTextFormatting } from '@/hooks/useTextFormatting';

interface MedicalTranscriptionFormatterProps {
  transcriptionText: string;
  onSaveFormatted: (formattedText: string, formatType: string) => void;
}

const MedicalTranscriptionFormatter: React.FC<MedicalTranscriptionFormatterProps> = ({
  transcriptionText,
  onSaveFormatted
}) => {
  const {
    formattedText,
    setFormattedText,
    isProcessing,
    formatError,
    formatType,
    setFormatType,
    formatTypes,
    restructureText
  } = useTextFormatting({ transcriptionText });
  
  const handleSave = () => {
    if (formattedText.trim()) {
      onSaveFormatted(formattedText, formatType);
    }
  };
  
  return (
    <div className="space-y-4">
      <FormatTypeSelector 
        formatType={formatType}
        onFormatTypeChange={setFormatType}
        formatTypes={formatTypes}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Format Medical Transcription</CardTitle>
          <CardDescription>
            Transform your raw transcription into a structured medical document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormattedTextEditor
            isProcessing={isProcessing}
            formattedText={formattedText}
            onFormattedTextChange={(value) => setFormattedText(value)}
            formatError={formatError}
          />
        </CardContent>
        <CardFooter>
          <FormatActionButtons
            onSave={handleSave}
            onFormat={restructureText}
            isProcessing={isProcessing}
            formattedText={formattedText}
            transcriptionText={transcriptionText}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default MedicalTranscriptionFormatter;
