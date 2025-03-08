
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { saveStructuredNote } from '@/services/noteService';
import toast from 'react-hot-toast';

export interface SaveNoteButtonProps {
  sections: any;
  structuredText: string;
}

export function SaveNoteButton({ sections, structuredText }: SaveNoteButtonProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNote = async () => {
    try {
      setIsSaving(true);
      // Pass structuredText as a string
      await saveStructuredNote(structuredText);
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSaveNote}
      disabled={isSaving}
    >
      <Save className="mr-2 h-4 w-4" />
      Save Note
    </Button>
  );
}
