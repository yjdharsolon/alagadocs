
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, X, Save } from 'lucide-react';
import { TextTemplate } from '@/components/structured-output/types';

interface TemplateFormProps {
  onCancel: () => void;
  onSave: (formData: { title: string; description: string; sections: string; isDefault: boolean }) => Promise<void>;
  editingTemplate: TextTemplate | null;
  defaultSections: string[];
}

const TemplateForm: React.FC<TemplateFormProps> = ({ 
  onCancel, 
  onSave, 
  editingTemplate, 
  defaultSections 
}) => {
  const [formState, setFormState] = useState({
    title: editingTemplate?.title || '',
    description: editingTemplate?.description || '',
    sections: editingTemplate ? editingTemplate.sections.join('\n') : defaultSections.join('\n'),
    isDefault: editingTemplate?.isDefault || false
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave(formState);
    setSaving(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</CardTitle>
        <CardDescription>
          Define the sections and format for your medical notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Template Title
          </label>
          <Input
            id="title"
            value={formState.title}
            onChange={handleInputChange}
            placeholder="E.g., Standard SOAP Note"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (Optional)
          </label>
          <Input
            id="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Briefly describe this template's purpose"
          />
        </div>
        <div>
          <label htmlFor="sections" className="block text-sm font-medium mb-1">
            Sections (One per line)
          </label>
          <Textarea
            id="sections"
            value={formState.sections}
            onChange={handleInputChange}
            placeholder="Add each section title on a new line"
            className="min-h-[150px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Template
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateForm;
