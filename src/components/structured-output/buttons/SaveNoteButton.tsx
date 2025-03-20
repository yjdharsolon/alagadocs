
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import { saveStructuredNote } from '@/services/structuredNote/saveNote';
import { MedicalSections } from '../types';

interface SaveNoteButtonProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  patientId?: string | null;
  transcriptionId: string;
  onNoteSaved?: () => void;
  selectedFormats?: Array<{
    formatType: string;
    structuredData: MedicalSections;
  }>;
  refreshData?: () => void;
}

export const SaveNoteButton: React.FC<SaveNoteButtonProps> = ({
  user,
  sections,
  structuredText,
  patientId,
  transcriptionId,
  onNoteSaved,
  selectedFormats = [],
  refreshData
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Log what we're about to save to help with debugging
  const logSaveData = () => {
    console.log('Saving note with sections:', sections);
    if (sections.medications) {
      console.log('Medications data being saved:', 
        Array.isArray(sections.medications) 
          ? JSON.stringify(sections.medications, null, 2) 
          : sections.medications
      );
      
      // Additional logging to ensure brand names are preserved
      if (Array.isArray(sections.medications)) {
        sections.medications.forEach((med: any, index: number) => {
          console.log(`Medication ${index + 1} - Brand name:`, med.brandName);
          console.log(`Medication ${index + 1} - Generic name:`, med.genericName);
        });
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      logSaveData();
      return saveStructuredNote(
        user.id,
        transcriptionId,
        sections,
        patientId
      );
    },
    onSuccess: (data) => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: "Note saved successfully!",
      });
      
      // Log the saved note ID
      console.log('Note saved successfully with ID:', data?.id || 'unknown');
      
      // Call refreshData to ensure data is fresh after saving
      if (refreshData) {
        console.log('Triggering data refresh after successful save');
        // Add a longer delay to ensure the database has time to update
        // This is critical for ensuring we get fresh data
        setTimeout(() => {
          refreshData();
          console.log('Data refresh triggered');
        }, 800);
      }
      
      if (onNoteSaved) {
        onNoteSaved();
      }
    },
    onError: (error: any) => {
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save note.",
      });
    },
  });

  const handleSaveNote = async () => {
    setIsSaving(true);
    mutation.mutate();
  };

  // Determine if save button should be disabled (when in Selection tab with no formats selected)
  const hasSelectedFormats = selectedFormats && selectedFormats.length > 0;

  return (
    <Button
      variant="outline"
      className="bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white flex items-center gap-2"
      onClick={handleSaveNote}
      disabled={isSaving || (!hasSelectedFormats && selectedFormats.length === 0)}
    >
      <Save className="h-4 w-4" />
      {isSaving ? 'Saving...' : 'Save Note'}
    </Button>
  );
};
