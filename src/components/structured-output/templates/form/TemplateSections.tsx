
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TemplateFormValues, TemplateSection } from '../../types';
import TemplateSection from './TemplateSection';

interface TemplateSectionsProps {
  form: UseFormReturn<TemplateFormValues>;
  sections: TemplateSection[];
  addSection: () => void;
  removeSection: (id: string) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  errors: any;
}

const TemplateSections = ({ 
  form, 
  sections, 
  addSection, 
  removeSection, 
  moveSection,
  errors 
}: TemplateSectionsProps) => {
  return (
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
        <TemplateSection
          key={section.id}
          index={index}
          sectionId={section.id}
          form={form}
          onRemove={removeSection}
          onMove={moveSection}
          isFirst={index === 0}
          isLast={index === sections.length - 1}
        />
      ))}
      
      {errors.sections && (
        <p className="text-sm font-medium text-destructive">
          {errors.sections.message}
        </p>
      )}
    </div>
  );
};

export default TemplateSections;
