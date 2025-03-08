
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { TemplateFormValues, TemplateSection } from '@/components/structured-output/types';

export default function CustomizeTemplatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultSection: TemplateSection = {
    id: Date.now().toString(),
    name: '',
    description: '',
    required: true
  };
  
  const [formValues, setFormValues] = useState<TemplateFormValues>({
    title: '',
    description: '',
    sections: [
      { id: '1', name: 'Chief Complaint', required: true, description: 'Brief statement of the primary reason for the visit' },
      { id: '2', name: 'History of Present Illness', required: true, description: 'Chronological description of the patient\'s symptoms' },
      { id: '3', name: 'Assessment', required: true, description: 'Diagnosis or clinical impression' },
      { id: '4', name: 'Plan', required: true, description: 'Treatment plan and recommendations' }
    ],
    isDefault: false
  });
  
  const handleAddSection = () => {
    setFormValues({
      ...formValues,
      sections: [...formValues.sections, { ...defaultSection, id: Date.now().toString() }]
    });
  };
  
  const handleRemoveSection = (id: string) => {
    setFormValues({
      ...formValues,
      sections: formValues.sections.filter(section => section.id !== id)
    });
  };
  
  const handleSectionChange = (id: string, field: keyof TemplateSection, value: string | boolean) => {
    setFormValues({
      ...formValues,
      sections: formValues.sections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to save templates');
      return;
    }
    
    if (formValues.title.trim() === '') {
      toast.error('Please provide a template title');
      return;
    }
    
    if (formValues.sections.length === 0) {
      toast.error('Please add at least one section to your template');
      return;
    }
    
    // Ensure all sections have names
    const invalidSections = formValues.sections.filter(section => section.name.trim() === '');
    if (invalidSections.length > 0) {
      toast.error('All sections must have names');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate template saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Template saved successfully!');
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create Custom Template</h1>
            <p className="text-muted-foreground mb-6">
              Design a template that fits your documentation workflow
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Information</CardTitle>
                  <CardDescription>
                    Basic details about your template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Template Title</Label>
                    <Input
                      id="title"
                      value={formValues.title}
                      onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                      placeholder="e.g., Standard SOAP Note"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formValues.description}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                      placeholder="Describe how and when this template should be used"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sections</CardTitle>
                    <CardDescription>
                      Define the sections of your template
                    </CardDescription>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddSection} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formValues.sections.map((section, index) => (
                    <div key={section.id} className="p-4 border rounded-md space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Section {index + 1}</h4>
                        <Button 
                          type="button" 
                          onClick={() => handleRemoveSection(section.id)} 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={formValues.sections.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`section-name-${section.id}`}>Section Name</Label>
                        <Input
                          id={`section-name-${section.id}`}
                          value={section.name}
                          onChange={(e) => handleSectionChange(section.id, 'name', e.target.value)}
                          placeholder="e.g., Chief Complaint"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`section-desc-${section.id}`}>Description (Optional)</Label>
                        <Textarea
                          id={`section-desc-${section.id}`}
                          value={section.description || ''}
                          onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                          placeholder="What kind of information should be included in this section"
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`section-required-${section.id}`}
                          checked={section.required}
                          onChange={(e) => handleSectionChange(section.id, 'required', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary-500"
                        />
                        <Label htmlFor={`section-required-${section.id}`} className="text-sm font-normal">
                          This section is required
                        </Label>
                      </div>
                    </div>
                  ))}
                  
                  {formValues.sections.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No sections added yet. Click "Add Section" to begin.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/templates')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1"
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
