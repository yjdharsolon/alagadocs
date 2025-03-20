
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TemplateSelectorProps {
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  setSelectedTemplate 
}) => {
  const predefinedTemplates = [
    { id: 'standard', name: 'Standard Medical Note', sections: [] },
    { id: 'soap', name: 'SOAP Note', sections: ['Subjective', 'Objective', 'Assessment', 'Plan'] },
    { id: 'history', name: 'History & Physical', sections: ['Chief Complaint', 'History of Present Illness', 'Past Medical History', 'Social History', 'Family History', 'Review of Systems', 'Physical Examination', 'Assessment', 'Plan'] },
    { id: 'progress', name: 'Progress Note', sections: ['Subjective', 'Objective', 'Medication Review', 'Assessment', 'Plan'] }
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Select template
      </label>
      <Select
        value={selectedTemplate}
        onValueChange={setSelectedTemplate}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {predefinedTemplates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
