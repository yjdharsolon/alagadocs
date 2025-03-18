
import React from 'react';
import { Form } from '@/components/ui/form';
import { TemplateFormValues } from '../types';
import TemplateHeader from './form/TemplateHeader';
import TemplateSections from './form/TemplateSections';
import TemplateFormActions from './form/TemplateFormActions';
import { useTemplateForm } from '@/hooks/useTemplateForm';
import { Button } from '@/components/ui/button';

interface TemplateFormProps {
  initialValues?: Partial<TemplateFormValues>;
  onSubmit: (values: TemplateFormValues) => void;
  onCancel: () => void;
}

const TemplateForm = ({ initialValues, onSubmit, onCancel }: TemplateFormProps) => {
  const { 
    form, 
    sections, 
    addSection, 
    removeSection, 
    moveSection,
    useSoapTemplate
  } = useTemplateForm(initialValues);

  const { handleSubmit, formState: { errors } } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TemplateHeader form={form} />
        
        <div className="flex justify-end space-x-2 mb-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={useSoapTemplate}
            className="text-xs"
            size="sm"
          >
            Use SOAP Template
          </Button>
        </div>
        
        <TemplateSections 
          form={form}
          sections={sections}
          addSection={addSection}
          removeSection={removeSection}
          moveSection={moveSection}
          errors={errors}
        />

        <TemplateFormActions 
          onCancel={onCancel} 
          isEditing={!!initialValues?.title} 
        />
      </form>
    </Form>
  );
};

export default TemplateForm;
