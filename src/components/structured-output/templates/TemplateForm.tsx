
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { TemplateFormValues, TemplateSection } from '../types';

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

  const { control, handleSubmit, formState: { errors }, watch, setValue } = form;
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter template title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Default Template</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Set this as your default template
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description for this template..." 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Template Sections</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addSection}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          {sections.map((section, index) => (
            <Card key={section.id} className="relative">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8">
                    <FormField
                      control={control}
                      name={`sections.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter section name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-4 flex items-end justify-end gap-2 pb-2">
                    <FormField
                      control={control}
                      name={`sections.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="!mt-0">Required</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-1">
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => removeSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {errors.sections && (
            <p className="text-sm font-medium text-destructive">
              {errors.sections.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialValues?.title ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TemplateForm;
