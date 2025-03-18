
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { TemplateFormValues, TemplateSection } from '../types';
import TemplateHeader from './form/TemplateHeader';
import TemplateSections from './form/TemplateSections';
import TemplateFormActions from './form/TemplateFormActions';

// Define validation schema
const templateFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, { message: 'Section name is required' }),
      description: z.string().optional(),
      required: z.boolean().default(true),
    })
  ).min(1, { message: 'At least one section is required' }),
  isDefault: z.boolean().default(false),
});

interface TemplateFormProps {
  initialValues?: Partial<TemplateFormValues>;
  onSubmit: (values: TemplateFormValues) => void;
  onCancel: () => void;
}

const TemplateForm = ({ initialValues, onSubmit, onCancel }: TemplateFormProps) => {
  const defaultSections: TemplateSection[] = [
    { id: crypto.randomUUID(), name: 'Chief Complaint', required: true },
    { id: crypto.randomUUID(), name: 'History of Present Illness', required: true },
    { id: crypto.randomUUID(), name: 'Past Medical History', required: true },
    { id: crypto.randomUUID(), name: 'Medications', required: true },
    { id: crypto.randomUUID(), name: 'Allergies', required: true },
    { id: crypto.randomUUID(), name: 'Physical Examination', required: true },
    { id: crypto.randomUUID(), name: 'Assessment', required: true },
    { id: crypto.randomUUID(), name: 'Plan', required: true },
  ];

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      sections: initialValues?.sections || defaultSections,
      isDefault: initialValues?.isDefault || false,
    }
  });

  const { handleSubmit, formState: { errors }, watch, setValue } = form;
  const sections = watch('sections');

  const addSection = () => {
    const newSection: TemplateSection = {
      id: crypto.randomUUID(),
      name: '',
      required: true
    };
    setValue('sections', [...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setValue('sections', sections.filter(section => section.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(section => section.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === sections.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...sections];
    const [removed] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, removed);
    setValue('sections', newSections);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TemplateHeader form={form} />
        
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
