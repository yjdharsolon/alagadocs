
import React from 'react';
import CopyButton from './CopyButton';
import EditButton from './EditButton';
import ExportButton from './ExportButton';
import { SaveNoteButton } from './SaveNoteButton';
import ViewNotesButton from './ViewNotesButton';
import { MedicalSections } from '../types';

interface ButtonGroupProps {
  onEdit?: () => void;
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
  transcriptionId?: string;
  patientId?: string | null;
  patientName?: string | null;
}

export function ButtonGroup({
  onEdit,
  user,
  sections,
  structuredText,
  transcriptionId = '',
  patientId = null,
  patientName = null
}: ButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sections && <CopyButton sections={sections} />}
      {onEdit && <EditButton onClick={onEdit} />}
      {sections && <ExportButton sections={sections} />}
      {user && sections && (
        <SaveNoteButton 
          user={user}
          sections={sections}
          structuredText={structuredText || ''}
          transcriptionId={transcriptionId}
          patientId={patientId}
        />
      )}
      <ViewNotesButton />
    </div>
  );
}
