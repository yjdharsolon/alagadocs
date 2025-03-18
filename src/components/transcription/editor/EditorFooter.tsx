
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FileText } from 'lucide-react';

interface EditorFooterProps {
  activeTab: string;
  onSave: () => void;
  onContinueToStructured: () => void;
  setActiveTab: (value: string) => void;
  isSaving: boolean;
  transcriptionText: string;
  formattedText: string;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  activeTab,
  onSave,
  onContinueToStructured,
  setActiveTab,
  isSaving,
  transcriptionText,
  formattedText
}) => {
  if (activeTab === 'edit') {
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
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
          onClick={() => setActiveTab('format')}
          disabled={!transcriptionText.trim()}
          className="w-full sm:w-auto bg-[#33C3F0] hover:bg-[#1EAEDB] text-white transition-colors duration-200"
        >
          <FileText className="h-4 w-4 mr-2" />
          Format Note
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      onClick={onContinueToStructured}
      disabled={!formattedText.trim() && !transcriptionText.trim()}
      className="ml-auto bg-[#33C3F0] hover:bg-[#1EAEDB] text-white transition-colors duration-200"
    >
      <FileText className="h-4 w-4 mr-2" />
      Continue to Structuring
    </Button>
  );
};

export default EditorFooter;
