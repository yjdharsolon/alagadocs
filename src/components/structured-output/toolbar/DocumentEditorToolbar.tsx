
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, List, AlignLeft } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DocumentEditorToolbarProps {
  onSave: () => void;
  viewFormat: 'paragraph' | 'bullets';
  onFormatChange: (format: 'paragraph' | 'bullets') => void;
}

const DocumentEditorToolbar: React.FC<DocumentEditorToolbarProps> = ({
  onSave,
  viewFormat,
  onFormatChange
}) => {
  return (
    <div className="flex justify-between mb-4 items-center">
      <Button 
        onClick={onSave} 
        className="flex items-center gap-2"
        aria-label="Save document changes"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        Save Changes
      </Button>
      
      <div className="space-y-1">
        <div className="text-sm font-medium" id="view-format-label">View Format</div>
        <ToggleGroup 
          type="single" 
          value={viewFormat}
          onValueChange={(value) => value && onFormatChange(value as 'paragraph' | 'bullets')}
          aria-labelledby="view-format-label"
        >
          <ToggleGroupItem value="paragraph" aria-label="Paragraph view">
            <AlignLeft className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Paragraph</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="bullets" aria-label="Bullet points view">
            <List className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Bullets</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default DocumentEditorToolbar;
