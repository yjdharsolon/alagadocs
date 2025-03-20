
import React from 'react';
import { Button } from '@/components/ui/button';
import { SaveNoteButton } from './buttons/SaveNoteButton';
import CopyButton from './buttons/CopyButton';
import ExportButton from './buttons/ExportButton';
import EditButton from './buttons/EditButton';
import EndConsultButton from './buttons/EndConsultButton';
import { MedicalSections } from './types';

interface DocumentActionsProps {
  user: any;
  structuredData: MedicalSections;
  structuredText: string;
  transcriptionId: string;
  patientInfo: {
    id: string | null;
    name: string | null;
  };
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onNoteSaved?: () => void;
  onEndConsult?: () => void;
  noteSaved?: boolean;
  selectedFormats?: Array<{
    formatType: string;
    structuredData: MedicalSections;
  }>;
  refreshData?: () => void;
  updateDataDirectly?: (data: MedicalSections) => void;
}

const DocumentActions = ({
  user,
  structuredData,
  structuredText,
  transcriptionId,
  patientInfo,
  isEditMode,
  onToggleEditMode,
  onNoteSaved,
  onEndConsult,
  noteSaved = false,
  selectedFormats = [],
  refreshData,
  updateDataDirectly
}: DocumentActionsProps) => {
  const handleEndConsult = () => {
    console.log('End consultation triggered from DocumentActions');
    if (onEndConsult) {
      onEndConsult();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!isEditMode ? (
        <>
          <SaveNoteButton 
            user={user} 
            sections={structuredData}
            structuredText={structuredText}
            patientId={patientInfo.id}
            transcriptionId={transcriptionId || ''}
            onNoteSaved={onNoteSaved}
            selectedFormats={selectedFormats}
            refreshData={refreshData}
            updateDataDirectly={updateDataDirectly}
          />
          <CopyButton sections={structuredData} />
          <ExportButton sections={structuredData} />
          <EditButton onClick={onToggleEditMode} />
          <EndConsultButton 
            isVisible={noteSaved} 
            onEndConsult={handleEndConsult}
          />
        </>
      ) : (
        <Button 
          type="button"
          variant="outline" 
          onClick={onToggleEditMode}
        >
          Cancel Editing
        </Button>
      )}
    </div>
  );
};

export default DocumentActions;
