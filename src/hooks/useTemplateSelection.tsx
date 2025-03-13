
import { useState, useEffect } from 'react';
import { TextTemplate } from '@/components/structured-output/types';
import { getUserTemplates } from '@/services/templateService';

interface UseTemplateSelectionParams {
  userId: string | undefined;
}

export const useTemplateSelection = ({ userId }: UseTemplateSelectionParams) => {
  const [templates, setTemplates] = useState<TextTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Fetch user templates
  useEffect(() => {
    const fetchTemplates = async () => {
      if (userId) {
        try {
          const userTemplates = await getUserTemplates(userId);
          setTemplates(userTemplates);
          
          // Find default template if exists
          const defaultTemplate = userTemplates.find(t => t.isDefault);
          if (defaultTemplate) {
            setSelectedTemplateId(defaultTemplate.id);
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      }
    };
    
    fetchTemplates();
  }, [userId]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    return templates.find(t => t.id === templateId) || null;
  };

  return {
    templates,
    selectedTemplateId,
    handleTemplateSelect
  };
};
