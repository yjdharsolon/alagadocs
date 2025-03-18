
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileText } from 'lucide-react';

interface EditorFooterProps {
  onSave: () => void;
  onContinueToStructured: () => void;
  isSaving: boolean;
  transcriptionText: string;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  onSave,
  onContinueToStructured,
  isSaving,
  transcriptionText
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4 w-full">
      <Button 
        variant="outline" 
        onClick={onSave}
        disabled={isSaving || !transcriptionText.trim()}
        className="w-full sm:w-auto border-[#33C3F0] text-[#33C3F0] hover:bg-[#33C3F0]/10 transition-colors duration-200"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
      <Button
        onClick={onContinueToStructured}
        disabled={!transcriptionText.trim()}
        className="w-full sm:w-auto bg-[#33C3F0] hover:bg-[#1EAEDB] text-white transition-colors duration-200"
      >
        <FileText className="h-4 w-4 mr-2" />
        Continue to Structuring
      </Button>
    </div>
  );
};

export default EditorFooter;
