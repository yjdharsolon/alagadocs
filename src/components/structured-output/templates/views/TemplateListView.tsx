
import React from 'react';
import { TextTemplate } from '@/components/structured-output/types';
import TemplateList from '@/components/structured-output/templates/TemplateList';

interface TemplateListViewProps {
  loading: boolean;
  templates: TextTemplate[];
  onEdit: (template: TextTemplate) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

const TemplateListView = ({ 
  loading, 
  templates, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: TemplateListViewProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  return (
    <TemplateList
      templates={templates}
      onEdit={onEdit}
      onDelete={onDelete}
      onSetDefault={onSetDefault}
    />
  );
};

export default TemplateListView;
