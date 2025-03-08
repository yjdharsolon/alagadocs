
import React from 'react';
import EditButton from './buttons/EditButton';
import ViewNotesButton from './buttons/ViewNotesButton';
import ActionButtons from './ActionButtons';
import { MedicalSections, TextTemplate } from './types';

interface StructuredOutputActionsProps {
  onEdit: () => void;
  onCopy: () => void;
  templates: TextTemplate[];
  onTemplateSelect: (templateId: string) => void;
  user: any;
  structuredData: MedicalSections;
}

const StructuredOutputActions = ({
  onEdit,
  onCopy,
  templates,
  onTemplateSelect,
  user,
  structuredData
}: StructuredOutputActionsProps) => {
  return (
    <div className="mt-6 flex justify-end space-x-2">
      <EditButton 
        onClick={onEdit}
        templates={templates}
        onTemplateSelect={onTemplateSelect}
        showTemplateSelector={templates.length > 0}
      />
      <ViewNotesButton />
      <ActionButtons 
        onCopy={onCopy}
        onEdit={onEdit}
        user={user}
        sections={structuredData}
        structuredText={JSON.stringify(structuredData)}
      />
    </div>
  );
};

export default StructuredOutputActions;
