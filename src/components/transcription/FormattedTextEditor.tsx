
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FormattedTextEditorProps {
  isProcessing: boolean;
  formattedText: string;
  onFormattedTextChange: (value: string) => void;
  formatError: string | null;
}

const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({
  isProcessing,
  formattedText,
  onFormattedTextChange,
  formatError
}) => {
  return (
    <div className="space-y-4">
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
          onChange={(e) => onFormattedTextChange(e.target.value)}
          placeholder="Structured medical text will appear here..."
          readOnly={isProcessing}
        />
      )}
    </div>
  );
};

export default FormattedTextEditor;
