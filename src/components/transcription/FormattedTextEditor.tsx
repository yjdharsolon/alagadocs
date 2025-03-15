
import React, { useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { useMemo } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = useMemo(() => {
    if (!formattedText) return [];
    return formattedText.split('\n');
  }, [formattedText]);

  const isLargeContent = lines.length > 200;

  // Optimize onChange handler with useCallback
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFormattedTextChange(e.target.value);
  }, [onFormattedTextChange]);

  // Render optimized for large content using virtualization
  const renderVirtualizedContent = () => {
    return (
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
        <Textarea 
          className="min-h-[100px] font-mono text-sm mt-2"
          value={formattedText}
          onChange={handleTextChange}
          placeholder="Edit your structured medical text here..."
          readOnly={isProcessing}
          ref={textareaRef}
        />
      </div>
    );
  };

  // Standard rendering for smaller content
  const renderStandardTextarea = () => (
    <Textarea 
      className="min-h-[300px] font-mono text-sm"
      value={formattedText}
      onChange={handleTextChange}
      placeholder="Structured medical text will appear here..."
      readOnly={isProcessing}
      ref={textareaRef}
    />
  );

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
        isLargeContent ? renderVirtualizedContent() : renderStandardTextarea()
      )}
    </div>
  );
};

export default FormattedTextEditor;
