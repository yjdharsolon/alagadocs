
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TextTemplate } from '@/components/structured-output/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import TemplateForm from './form/TemplateForm';
import TemplateGrid from './TemplateGrid';
import { useTemplateManager } from '@/hooks/useTemplateManager';

interface TemplateManagerProps {
  onSelectTemplate?: (template: TextTemplate) => void;
  selectable?: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  onSelectTemplate, 
  selectable = false 
}) => {
  const { user } = useAuth();
  const {
    templates,
    loading,
    showCreateForm,
    editingTemplate,
    deleting,
    defaultSections,
    handleCreateTemplate,
    handleEditTemplate,
    handleCancelForm,
    handleSaveTemplate,
    handleDeleteTemplate,
    handleSelectTemplate
  } = useTemplateManager(user?.id, selectable);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Templates</h2>
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {showCreateForm && (
        <TemplateForm
          onCancel={handleCancelForm}
          onSave={handleSaveTemplate}
          editingTemplate={editingTemplate}
          defaultSections={defaultSections}
        />
      )}

      <TemplateGrid
        templates={templates}
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
        deleting={deleting}
        onCreateTemplate={handleCreateTemplate}
        selectable={selectable}
        onSelectTemplate={onSelectTemplate ? (template: TextTemplate) => onSelectTemplate(template) : undefined}
        showCreateForm={showCreateForm}
      />
    </div>
  );
};

export default TemplateManager;
