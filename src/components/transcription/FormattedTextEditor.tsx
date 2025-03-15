
import React, { useRef, useCallback, useEffect } from 'react';
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

  // Focus the textarea when processing completes
  useEffect(() => {
    if (!isProcessing && formattedText && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isProcessing, formattedText]);

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
          aria-label="Formatted text preview (read-only)"
          tabIndex={0}
          role="region"
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
          aria-label="Edit formatted medical text"
          aria-readonly={isProcessing}
          aria-required="true"
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
      aria-label="Edit formatted medical text"
      aria-readonly={isProcessing}
      aria-required="true"
    />
  );

  return (
    <div className="space-y-4">
      {formatError && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>
            {formatError}
          </AlertDescription>
        </Alert>
      )}
      
      {isProcessing ? (
        <div className="space-y-4" aria-live="polite">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">AI is structuring your medical text...</p>
          </div>
          <Skeleton className="h-[300px] w-full" aria-label="Loading formatted content" />
        </div>
      ) : (
        <div aria-live="polite">
          {isLargeContent ? renderVirtualizedContent() : renderStandardTextarea()}
        </div>
      )}
    </div>
  );
};

export default FormattedTextEditor;
