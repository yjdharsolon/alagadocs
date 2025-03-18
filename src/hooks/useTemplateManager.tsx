
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TextTemplate } from '@/components/structured-output/types';
import toast from 'react-hot-toast';

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

export function useTemplateManager(userId: string | undefined, selectable = false) {
  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TextTemplate | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchTemplates();
    }
  }, [userId]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_templates')
        .select('*')
        .eq('user_id', userId)
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
    setEditingTemplate(null);
    setShowCreateForm(true);
  };

  const handleEditTemplate = (template: TextTemplate) => {
    setEditingTemplate(template);
    setShowCreateForm(true);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = async (formData: { 
    title: string; 
    description: string; 
    sections: string; 
    isDefault: boolean 
  }) => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const sectionsList = formData.sections
      .split('\n')
      .map(section => section.trim())
      .filter(section => section !== '');

    if (sectionsList.length === 0) {
      toast.error('At least one section is required');
      return;
    }

    try {
      // If we're editing an existing template
      if (editingTemplate) {
        const { error } = await supabase
          .from('text_templates')
          .update({
            title: formData.title,
            description: formData.description,
            sections: sectionsList,
            is_default: formData.isDefault,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        
        // Update the local state
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, title: formData.title, description: formData.description, sections: sectionsList, isDefault: formData.isDefault }
            : t
        ));
        
        toast.success('Template updated successfully');
      } else {
        // We're creating a new template
        const { data, error } = await supabase
          .from('text_templates')
          .insert({
            user_id: userId,
            title: formData.title,
            description: formData.description,
            sections: sectionsList,
            is_default: formData.isDefault
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
    return template;
  };

  return {
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
  };
}
