
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { TextTemplate, TemplateFormValues } from '@/components/structured-output/types';
import { 
  getUserTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  setDefaultTemplate 
} from '@/services/templateService';
import { toast } from 'react-hot-toast';
import { TabsContent } from '@/components/ui/tabs';

// Import the newly created components
import TemplateActions from '@/components/structured-output/templates/TemplateActions';
import TemplateTabs from '@/components/structured-output/templates/TemplateTabs';
import TemplateListView from '@/components/structured-output/templates/views/TemplateListView';
import CreateEditTemplateView from '@/components/structured-output/templates/views/CreateEditTemplateView';

export default function Templates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<string>('view');
  const [selectedTemplate, setSelectedTemplate] = useState<TextTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (user) {
        try {
          setLoading(true);
          const userTemplates = await getUserTemplates(user.id);
          setTemplates(userTemplates);
        } catch (error) {
          console.error('Error fetching templates:', error);
          toast.error('Failed to load templates');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTemplates();
  }, [user]);

  const handleCreateTemplate = async (formValues: TemplateFormValues) => {
    if (!user) return;

    try {
      const sectionNames = formValues.sections.map(section => section.name);
      const newTemplate = await createTemplate(user.id, {
        title: formValues.title,
        description: formValues.description,
        sections: sectionNames,
        isDefault: formValues.isDefault
      });

      if (newTemplate) {
        if (formValues.isDefault) {
          await setDefaultTemplate(user.id, newTemplate.id);
        }
        
        setTemplates(prev => [newTemplate, ...prev.map(t => 
          t.isDefault && formValues.isDefault ? { ...t, isDefault: false } : t
        )]);
        
        setActiveTab('view');
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleUpdateTemplate = async (formValues: TemplateFormValues) => {
    if (!selectedTemplate || !user) return;

    try {
      const sectionNames = formValues.sections.map(section => section.name);
      const updatedTemplate = await updateTemplate(selectedTemplate.id, {
        title: formValues.title,
        description: formValues.description,
        sections: sectionNames,
        isDefault: formValues.isDefault
      });

      if (updatedTemplate) {
        if (formValues.isDefault) {
          await setDefaultTemplate(user.id, selectedTemplate.id);
        }
        
        setTemplates(prev => prev.map(t => 
          t.id === selectedTemplate.id 
            ? updatedTemplate 
            : (t.isDefault && formValues.isDefault ? { ...t, isDefault: false } : t)
        ));
        
        setSelectedTemplate(null);
        setActiveTab('view');
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleSubmit = async (formValues: TemplateFormValues) => {
    if (selectedTemplate) {
      await handleUpdateTemplate(formValues);
    } else {
      await handleCreateTemplate(formValues);
    }
  };

  const handleEditTemplate = (template: TextTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('edit');
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const success = await deleteTemplate(templateId);
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleSetDefault = async (templateId: string) => {
    if (!user) return;
    
    try {
      const success = await setDefaultTemplate(user.id, templateId);
      if (success) {
        setTemplates(prev => prev.map(t => ({
          ...t,
          isDefault: t.id === templateId
        })));
      }
    } catch (error) {
      console.error('Error setting default template:', error);
    }
  };

  const handleCancel = () => {
    setSelectedTemplate(null);
    setActiveTab('view');
  };

  const handleCreateNew = () => {
    setActiveTab('create');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <TemplateActions 
          activeTab={activeTab}
          onCreateNew={handleCreateNew}
        />
        
        <TemplateTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedTemplate={selectedTemplate}
        >
          <TabsContent value="view">
            <TemplateListView
              loading={loading}
              templates={templates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onSetDefault={handleSetDefault}
            />
          </TabsContent>
          
          <CreateEditTemplateView
            selectedTemplate={selectedTemplate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </TemplateTabs>
      </div>
    </Layout>
  );
}
