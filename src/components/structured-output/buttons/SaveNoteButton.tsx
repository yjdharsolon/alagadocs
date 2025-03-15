
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { saveStructuredNote } from '@/services/structuredNoteService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MedicalSections } from '@/components/structured-output/types';

export interface SaveNoteButtonProps {
  user: any; 
  sections: MedicalSections;
  structuredText: string;
  patientId?: string | null;
  transcriptionId: string;
  onNoteSaved?: () => void;
}

export function SaveNoteButton({ 
  user, 
  sections, 
  structuredText, 
  patientId,
  transcriptionId,
  onNoteSaved
}: SaveNoteButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const navigate = useNavigate();

  const handleSaveNote = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save notes');
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('Saving structured note with patient ID:', patientId);
      
      // Using the structuredNoteService to save the note with patient association
      await saveStructuredNote(
        user.id,
        transcriptionId,
        sections,
        patientId
      );
      
      toast.success('Note saved successfully!');
      setNoteSaved(true);
      
      // Call the callback if provided
      if (onNoteSaved) {
        onNoteSaved();
      }
      
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
      disabled={isSaving || noteSaved}
    >
      <Save className="mr-2 h-4 w-4" />
      {isSaving ? 'Saving...' : noteSaved ? 'Note Saved' : 'Save Note'}
    </Button>
  );
}
