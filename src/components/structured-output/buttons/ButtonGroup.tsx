
import React from 'react';
import EditButton from './EditButton';
import ViewNotesButton from './ViewNotesButton';
import ExportButton from './ExportButton';
import SaveNoteButton from './SaveNoteButton';
import CopyButton from './CopyButton';
import { MedicalSections } from '../types';

interface ButtonGroupProps {
  onEdit: () => void;
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
}

const ButtonGroup = ({ onEdit, user, sections, structuredText }: ButtonGroupProps) => {
  return (
    <div className="flex justify-between w-full flex-wrap gap-2">
      <div className="flex gap-2">
        <EditButton onClick={onEdit} />
        <ViewNotesButton />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <ExportButton sections={sections} />
        <SaveNoteButton 
          user={user} 
          sections={sections} 
          structuredText={structuredText} 
        />
        <CopyButton sections={sections} />
      </div>
    </div>
  );
};

export default ButtonGroup;
