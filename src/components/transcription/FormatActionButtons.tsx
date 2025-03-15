
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Wand2, Loader2 } from 'lucide-react';

interface FormatActionButtonsProps {
  onSave: () => void;
  onFormat: () => void;
  isProcessing: boolean;
  formattedText: string;
  transcriptionText: string;
}

// Use memo to prevent unnecessary re-renders
const FormatActionButtons: React.FC<FormatActionButtonsProps> = memo(({
  onSave,
  onFormat,
  isProcessing,
  formattedText,
  transcriptionText
}) => {
  return (
    <div className="flex justify-between flex-wrap gap-2" role="group" aria-label="Formatting actions">
      <Button 
        variant="outline" 
        onClick={onSave}
        disabled={isProcessing || !formattedText.trim()}
        aria-label="Save formatted text"
      >
        <Save className="mr-2 h-4 w-4" aria-hidden="true" />
        <span>Save Formatted Text</span>
      </Button>
      <Button 
        onClick={onFormat}
        disabled={isProcessing || !transcriptionText.trim()}
        aria-label={isProcessing ? "Processing text with AI" : "Format text with AI"}
        aria-busy={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Format with AI</span>
          </>
        )}
      </Button>
    </div>
  );
});

FormatActionButtons.displayName = 'FormatActionButtons';

export default FormatActionButtons;
