
import React from 'react';
import EditButton from './buttons/EditButton';
import ViewNotesButton from './buttons/ViewNotesButton';
import ActionButtons from './ActionButtons';
import { MedicalSections, TextTemplate } from './types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface StructuredOutputActionsProps {
  onEdit: () => void;
  onCopy: () => void;
  templates: TextTemplate[];
  onTemplateSelect: (templateId: string) => void;
  user: any;
  structuredData: MedicalSections;
  onToggleEditMode?: () => void;
  isEditMode?: boolean;
}

const StructuredOutputActions = ({
  onEdit,
  onCopy,
  templates,
  onTemplateSelect,
  user,
  structuredData,
  onToggleEditMode,
  isEditMode
}: StructuredOutputActionsProps) => {
  return (
    <div className="mt-6 flex justify-between space-x-2">
      <div>
        {onToggleEditMode && (
          <Button 
            variant={isEditMode ? "default" : "outline"}
            onClick={onToggleEditMode}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditMode ? "View Mode" : "Edit Document"}
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default StructuredOutputActions;
