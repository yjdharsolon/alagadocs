
import React from 'react';
import { CopyButton } from './CopyButton';
import { EditButton } from './EditButton';
import { ExportButton } from './ExportButton';
import { SaveNoteButton } from './SaveNoteButton';
import { ViewNotesButton } from './ViewNotesButton';

interface ButtonGroupProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  sections: any;
  structuredText: string;
}

export function ButtonGroup({
  isEditing,
  setIsEditing,
  sections,
  structuredText,
}: ButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <CopyButton structuredText={structuredText} />
      <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
      <ExportButton structuredText={structuredText} />
      <SaveNoteButton 
        sections={sections}
        structuredText={structuredText}
      />
      <ViewNotesButton />
    </div>
  );
}
