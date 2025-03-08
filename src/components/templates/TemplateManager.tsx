
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TextTemplate } from '@/components/structured-output/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateManagerProps {
  onSelectTemplate?: (template: TextTemplate) => void;
  selectable?: boolean;
}

const defaultSections = [
  'Chief Complaint',
  'History of Present Illness',
  'Past Medical History',
  'Medications',
  'Allergies',
  'Physical Examination',
  'Assessment',
  'Plan'
];

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  onSelectTemplate, 
  selectable = false 
}) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TextTemplate | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    sections: defaultSections.join('\n'),
    isDefault: false
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_templates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert from database format to our app format
      const formattedTemplates = data.map(template => ({
        id: template.id,
        title: template.title,
        description: template.description || '',
        sections: template.sections as string[],
        isDefault: template.is_default
      }));

      setTemplates(formattedTemplates);
    } catch (error: any) {
      console.error('Error fetching templates:', error.message);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setFormState({
      title: '',
      description: '',
      sections: defaultSections.join('\n'),
      isDefault: false
    });
    setEditingTemplate(null);
    setShowCreateForm(true);
  };

  const handleEditTemplate = (template: TextTemplate) => {
    setFormState({
      title: template.title,
      description: template.description || '',
      sections: template.sections.join('\n'),
      isDefault: template.isDefault
    });
    setEditingTemplate(template);
    setShowCreateForm(true);
  };

  const handleSaveTemplate = async () => {
    if (!formState.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const sectionsList = formState.sections
      .split('\n')
      .map(section => section.trim())
      .filter(section => section !== '');

    if (sectionsList.length === 0) {
      toast.error('At least one section is required');
      return;
    }

    try {
      setSaving(true);
      
      // If we're editing an existing template
      if (editingTemplate) {
        const { error } = await supabase
          .from('text_templates')
          .update({
            title: formState.title,
            description: formState.description,
            sections: sectionsList,
            is_default: formState.isDefault,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        
        // Update the local state
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, title: formState.title, description: formState.description, sections: sectionsList, isDefault: formState.isDefault }
            : t
        ));
        
        toast.success('Template updated successfully');
      } else {
        // We're creating a new template
        const { data, error } = await supabase
          .from('text_templates')
          .insert({
            user_id: user?.id,
            title: formState.title,
            description: formState.description,
            sections: sectionsList,
            is_default: formState.isDefault
          })
          .select();

        if (error) throw error;
        
        if (data && data[0]) {
          const newTemplate = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description || '',
            sections: data[0].sections as string[],
            isDefault: data[0].is_default
          };
          
          setTemplates([newTemplate, ...templates]);
          toast.success('Template created successfully');
        }
      }
      
      // Reset form
      setShowCreateForm(false);
      setEditingTemplate(null);
      
    } catch (error: any) {
      console.error('Error saving template:', error.message);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from('text_templates')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTemplates(templates.filter(template => template.id !== id));
      toast.success('Template deleted successfully');
    } catch (error: any) {
      console.error('Error deleting template:', error.message);
      toast.error('Failed to delete template');
    } finally {
      setDeleting(null);
    }
  };

  const handleSelectTemplate = (template: TextTemplate) => {
    if (onSelectTemplate && selectable) {
      onSelectTemplate(template);
    }
  };

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
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
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
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
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
                onChange={(e) => setFormState({ ...formState, sections: e.target.value })}
                placeholder="Add each section title on a new line"
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateForm(false);
                setEditingTemplate(null);
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTemplate}
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
      )}

      {templates.length === 0 && !showCreateForm ? (
        <div className="text-center p-8 border rounded-lg bg-background">
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-4">
            Create custom templates to structure your medical notes exactly how you prefer.
          </p>
          <Button onClick={handleCreateTemplate}>
            Create Your First Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className={`overflow-hidden transition-shadow hover:shadow-md ${selectable ? 'cursor-pointer' : ''}`} onClick={selectable ? () => handleSelectTemplate(template) : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{template.title}</CardTitle>
                {template.description && (
                  <CardDescription>{template.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {template.sections.length} sections
                </div>
                <div className="space-y-1">
                  {template.sections.slice(0, 3).map((section, index) => (
                    <div key={index} className="text-sm py-1 px-2 bg-secondary/20 rounded">
                      {section}
                    </div>
                  ))}
                  {template.sections.length > 3 && (
                    <div className="text-sm text-muted-foreground">
                      +{template.sections.length - 3} more sections
                    </div>
                  )}
                </div>
              </CardContent>
              {!selectable && (
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    disabled={deleting === template.id}
                  >
                    {deleting === template.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
