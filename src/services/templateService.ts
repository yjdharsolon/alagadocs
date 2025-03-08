
import { supabase } from '@/integrations/supabase/client';
import { TextTemplate } from '@/components/structured-output/types';
import toast from 'react-hot-toast';

/**
 * Fetches all templates for a user
 */
export const getUserTemplates = async (userId: string): Promise<TextTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('text_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    
    return data as TextTemplate[];
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    toast.error(error.message || 'Failed to load templates');
    return [];
  }
};

/**
 * Creates a new template
 */
export const createTemplate = async (
  userId: string,
  template: Omit<TextTemplate, 'id'>
): Promise<TextTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('text_templates')
      .insert({
        user_id: userId,
        title: template.title,
        description: template.description || '',
        sections: template.sections,
        is_default: template.isDefault,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating template:', error);
      throw error;
    }
    
    toast.success('Template created successfully');
    return data as TextTemplate;
  } catch (error: any) {
    console.error('Error creating template:', error);
    toast.error(error.message || 'Failed to create template');
    return null;
  }
};

/**
 * Updates an existing template
 */
export const updateTemplate = async (
  templateId: string,
  template: Partial<TextTemplate>
): Promise<TextTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('text_templates')
      .update({
        title: template.title,
        description: template.description,
        sections: template.sections,
        is_default: template.isDefault,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating template:', error);
      throw error;
    }
    
    toast.success('Template updated successfully');
    return data as TextTemplate;
  } catch (error: any) {
    console.error('Error updating template:', error);
    toast.error(error.message || 'Failed to update template');
    return null;
  }
};

/**
 * Deletes a template
 */
export const deleteTemplate = async (templateId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('text_templates')
      .delete()
      .eq('id', templateId);
    
    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
    
    toast.success('Template deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting template:', error);
    toast.error(error.message || 'Failed to delete template');
    return false;
  }
};

/**
 * Gets a template by ID
 */
export const getTemplateById = async (templateId: string): Promise<TextTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('text_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
    
    return data as TextTemplate;
  } catch (error: any) {
    console.error('Error fetching template:', error);
    toast.error(error.message || 'Failed to load template');
    return null;
  }
};

/**
 * Sets a template as the default for a user
 */
export const setDefaultTemplate = async (userId: string, templateId: string): Promise<boolean> => {
  try {
    // First, unset default status for all user templates
    const { error: resetError } = await supabase
      .from('text_templates')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (resetError) {
      console.error('Error resetting default templates:', resetError);
      throw resetError;
    }
    
    // Then set the selected template as default
    const { error } = await supabase
      .from('text_templates')
      .update({ is_default: true })
      .eq('id', templateId);
    
    if (error) {
      console.error('Error setting default template:', error);
      throw error;
    }
    
    toast.success('Default template updated');
    return true;
  } catch (error: any) {
    console.error('Error setting default template:', error);
    toast.error(error.message || 'Failed to update default template');
    return false;
  }
};
