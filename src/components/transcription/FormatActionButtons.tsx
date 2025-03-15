
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
    <div className="flex justify-between flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={onSave}
        disabled={isProcessing || !formattedText.trim()}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Formatted Text
      </Button>
      <Button 
        onClick={onFormat}
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
    </div>
  );
});

FormatActionButtons.displayName = 'FormatActionButtons';

export default FormatActionButtons;
