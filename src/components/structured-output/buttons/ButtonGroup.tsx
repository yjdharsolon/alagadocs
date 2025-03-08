
import React from 'react';
import CopyButton from './CopyButton';
import EditButton from './EditButton';
import ExportButton from './ExportButton';
import { SaveNoteButton } from './SaveNoteButton';
import ViewNotesButton from './ViewNotesButton';

interface ButtonGroupProps {
  onEdit?: () => void;
  user?: any;
  sections?: any;
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
      {structuredText && <CopyButton structuredText={structuredText} />}
      {onEdit && <EditButton onClick={onEdit} />}
      {structuredText && <ExportButton structuredText={structuredText} />}
      {user && sections && structuredText && (
        <SaveNoteButton 
          sections={sections}
          structuredText={structuredText}
        />
      )}
      <ViewNotesButton />
    </div>
  );
}
