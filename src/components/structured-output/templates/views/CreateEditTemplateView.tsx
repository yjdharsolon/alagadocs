
import React from 'react';
import { TextTemplate, TemplateFormValues } from '@/components/structured-output/types';
import TemplateForm from '@/components/structured-output/templates/TemplateForm';
import { TabsContent } from '@/components/ui/tabs';

interface CreateEditTemplateViewProps {
  selectedTemplate: TextTemplate | null;
  onSubmit: (formValues: TemplateFormValues) => Promise<void>;
  onCancel: () => void;
}

const CreateEditTemplateView = ({ 
  selectedTemplate, 
  onSubmit, 
  onCancel 
}: CreateEditTemplateViewProps) => {
  // Show create template view
  if (!selectedTemplate) {
    return (
      <TabsContent value="create">
        <TemplateForm
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </TabsContent>
    );
  }
  
  // Show edit template view
  return (
    <TabsContent value="edit">
      <TemplateForm
        initialValues={{
          title: selectedTemplate.title,
          description: selectedTemplate.description || '',
          isDefault: selectedTemplate.isDefault,
          sections: selectedTemplate.sections.map(name => ({
            id: crypto.randomUUID(),
            name,
            required: true
          }))
        }}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </TabsContent>
  );
};

export default CreateEditTemplateView;
