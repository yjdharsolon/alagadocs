
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, CheckCircle2, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveStructuredNote } from '@/services/transcriptionService';
import { MedicalSections } from './types';

interface ActionButtonsProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  handleEdit: () => void;
}

const ActionButtons = ({ user, sections, structuredText, handleEdit }: ActionButtonsProps) => {
  const [copied, setCopied] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(structuredText)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const handleSaveNote = async () => {
    if (!user) {
      toast.error('You must be logged in to save notes');
      return;
    }
    
    try {
      setSaving(true);
      // Generate a title from the chief complaint or first line
      const title = sections.chiefComplaint || 'Medical Note';
      
      await saveStructuredNote(user.id, title, structuredText);
      toast.success('Note saved successfully!');
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast.error(error.message || 'Error saving note');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="flex justify-between flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={handleEdit}
      >
        Edit
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleSaveNote}
          disabled={saving || !user}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Note
            </>
          )}
        </Button>
        <Button
          onClick={copyToClipboard}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" />
              Copy to EMR
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
