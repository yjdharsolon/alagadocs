
import React from 'react';
import { TextTemplate } from '@/components/structured-output/types';
import TemplateCard from './TemplateCard';
import EmptyTemplateState from './EmptyTemplateState';

interface TemplateGridProps {
  templates: TextTemplate[];
  onEdit: (template: TextTemplate) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
  onCreateTemplate: () => void;
  selectable?: boolean;
  onSelectTemplate?: (template: TextTemplate) => void;
  showCreateForm: boolean;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ 
  templates, 
  onEdit, 
  onDelete, 
  deleting, 
  onCreateTemplate, 
  selectable = false,
  onSelectTemplate,
  showCreateForm
}) => {
  if (templates.length === 0 && !showCreateForm) {
    return <EmptyTemplateState onCreateTemplate={onCreateTemplate} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
          selectable={selectable}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
