
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import TemplateForm from '@/components/structured-output/templates/TemplateForm';
import TemplateList from '@/components/structured-output/templates/TemplateList';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Templates</h1>
          </div>
          
          <div>
            {activeTab === 'view' && (
              <Button 
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            )}
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="view">View Templates</TabsTrigger>
            <TabsTrigger value={selectedTemplate ? 'edit' : 'create'}>
              {selectedTemplate ? 'Edit Template' : 'Create Template'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            ) : (
              <TemplateList
                templates={templates}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                onSetDefault={handleSetDefault}
              />
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <TemplateForm
              onSubmit={handleCreateTemplate}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="edit">
            {selectedTemplate && (
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
                onSubmit={handleUpdateTemplate}
                onCancel={handleCancel}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
