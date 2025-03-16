
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { MedicalSections } from '../types';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { saveStructuredNote } from '@/services/structuredNote/saveNote';

interface SaveNoteButtonProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  transcriptionId: string;
  patientId?: string | null;
  onNoteSaved?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const SaveNoteButton: React.FC<SaveNoteButtonProps> = ({
  user,
  sections,
  structuredText,
  transcriptionId,
  patientId = null,
  onNoteSaved,
  variant = 'default',
  size = 'default'
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id || !transcriptionId) {
      toast.error('Missing required information to save note');
      return;
    }
    
    try {
      setIsSaving(true);
      console.log('Saving note with data:', { userId: user.id, transcriptionId, sections, patientId });
      
      const result = await saveStructuredNote(
        user.id,
        transcriptionId,
        sections,
        patientId
      );
      
      toast.success('Note saved successfully');
      
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
      variant={variant} 
      size={size} 
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center gap-2"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      Save Note
    </Button>
  );
};
