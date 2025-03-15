
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { saveStructuredNote } from '@/services/noteService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface SaveNoteButtonProps {
  user: any; 
  sections: any;
  structuredText: string;
}

export function SaveNoteButton({ user, sections, structuredText }: SaveNoteButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveNote = async () => {
    try {
      setIsSaving(true);
      // Pass structuredText as a string
      await saveStructuredNote(structuredText);
      toast.success('Note saved successfully!');
      
      // After successful save, navigate to select-patient page
      setTimeout(() => {
        navigate('/select-patient');
      }, 1500); // 1.5 second delay to show the success message
      
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
      {isSaving ? 'Saving...' : 'Save Note'}
    </Button>
  );
}
