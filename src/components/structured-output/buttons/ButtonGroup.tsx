
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
}

export function ButtonGroup({
  onEdit,
  user,
  sections,
  structuredText,
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
        />
      )}
      <ViewNotesButton />
    </div>
  );
}
