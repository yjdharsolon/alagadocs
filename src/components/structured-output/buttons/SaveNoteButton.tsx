
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { MedicalSections } from '../types';
import { saveUserNote } from '@/services/noteService';
import { toast } from 'sonner';

interface SaveNoteButtonProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  patientId: string | null;
  transcriptionId: string;
  onNoteSaved?: () => void;
  selectedFormats?: Array<{
    formatType: string;
    structuredData: MedicalSections;
  }>;
  refreshData?: () => void;
  updateDataDirectly?: (data: MedicalSections) => void;
  disableRefreshAfterSave?: boolean;
}

export const SaveNoteButton: React.FC<SaveNoteButtonProps> = ({ 
  user, 
  sections, 
  structuredText, 
  patientId, 
  transcriptionId,
  onNoteSaved,
  selectedFormats = [],
  refreshData,
  updateDataDirectly,
  disableRefreshAfterSave = true // Default to true to disable refresh
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save notes');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Saving note with formats:', selectedFormats.length > 0 
        ? selectedFormats.map(f => f.formatType).join(', ')
        : 'single format');
      console.log('[SaveNoteButton] Refresh after save is:', disableRefreshAfterSave ? 'DISABLED' : 'enabled');
      
      // If we have selected formats, save those
      if (selectedFormats.length > 0) {
        // Save each selected format
        for (const format of selectedFormats) {
          await saveUserNote({
            userId: user.id,
            patientId: patientId || undefined,
            transcriptionId,
            content: format.structuredData,
            formatType: format.formatType
          });
        }
      } else {
        // Save the current format only
        await saveUserNote({
          userId: user.id,
          patientId: patientId || undefined,
          transcriptionId,
          content: sections
        });
      }
      
      toast.success('Note saved successfully');
      
      // Call the callback if provided
      if (onNoteSaved) {
        onNoteSaved();
      }
      
      // Skip refresh completely - we're forcing disableRefreshAfterSave to be true
      console.log('[SaveNoteButton] Skipping data refresh after save - refresh is disabled');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Button 
      variant="default" 
      onClick={handleSave}
      disabled={isSaving}
    >
      <Save className="mr-2 h-4 w-4" />
      {isSaving ? 'Saving...' : 'Save Note'}
    </Button>
  );
};
