
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
  selectedFormats?: Array<{
    formatType: string;
    structuredData: MedicalSections;
  }>;
}

export const SaveNoteButton: React.FC<SaveNoteButtonProps> = ({
  user,
  sections,
  structuredText,
  transcriptionId,
  patientId = null,
  onNoteSaved,
  variant = 'default',
  size = 'default',
  selectedFormats = []
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id || !transcriptionId) {
      toast.error('Missing required information to save note');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // If we have selected formats, save those. Otherwise, save the current sections
      if (selectedFormats && selectedFormats.length > 0) {
        console.log(`Saving ${selectedFormats.length} selected formats`);
        
        // Combine all selected formats into one note with format type markers
        const combinedSections = selectedFormats.reduce((combined, format) => {
          // Add a format type marker to each section
          const formattedSections = Object.entries(format.structuredData).reduce((acc, [key, value]) => {
            acc[key] = `[${format.formatType.toUpperCase()}] ${value}`;
            return acc;
          }, {} as MedicalSections);
          
          // Merge with other formats
          return { ...combined, ...formattedSections };
        }, {} as MedicalSections);
        
        const result = await saveStructuredNote(
          user.id,
          transcriptionId,
          combinedSections,
          patientId
        );
        
        toast.success(`Successfully saved ${selectedFormats.length} selected format(s)`);
      } else {
        console.log('Saving note with data:', { userId: user.id, transcriptionId, sections, patientId });
        
        const result = await saveStructuredNote(
          user.id,
          transcriptionId,
          sections,
          patientId
        );
        
        toast.success('Note saved successfully');
      }
      
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
      disabled={isSaving || (selectedFormats && selectedFormats.length === 0)}
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
