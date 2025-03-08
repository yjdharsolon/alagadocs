
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveStructuredNote } from '@/services/transcriptionService';
import { MedicalSections } from '../types';

interface SaveNoteButtonProps {
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
}

const SaveNoteButton = ({ user, sections, structuredText }: SaveNoteButtonProps) => {
  const [saving, setSaving] = useState(false);
  
  const handleSaveNote = async () => {
    if (!user || !sections || !structuredText) {
      toast.error('Missing required data to save note');
      return;
    }
    
    try {
      setSaving(true);
      // Generate a title from the chief complaint or first line
      const title = sections.chiefComplaint.substring(0, 50) || 'Medical Note';
      
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
    <Button
      variant="outline"
      onClick={handleSaveNote}
      disabled={saving || !user || !sections || !structuredText}
      className="flex items-center gap-1"
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
  );
};

export default SaveNoteButton;
