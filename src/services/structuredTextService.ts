
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';
import { TextTemplate, TextTemplateResponse } from '@/components/structured-output/types';

/**
 * Maps database response to TextTemplate interface
 */
const mapToTextTemplate = (template: TextTemplateResponse): TextTemplate => {
  return {
    id: template.id,
    title: template.title,
    description: template.description || undefined,
    sections: template.sections as string[],
    isDefault: template.is_default
  };
};

/**
 * Processes raw transcription text into structured medical notes
 */
export const structureText = async (
  transcriptionText: string, 
  userRole: string | null = 'Doctor',
  template?: TextTemplate
): Promise<any> => {
  try {
    const body: any = { 
      text: transcriptionText, 
      role: userRole 
    };
    
    if (template) {
      body.template = {
        sections: template.sections
      };
    }
    
    const { data, error } = await supabase.functions.invoke('openai-structure-text', {
      body
    });

    if (error) {
      console.error('Error structuring text:', error);
      toast.error('Failed to structure the text. Please try again.');
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error structuring text:', error);
    toast.error(error.message || 'Failed to structure the text. Please try again.');
    throw error;
  }
};

/**
 * Saves structured text to the database
 */
export const saveStructuredText = async (
  userId: string,
  transcriptionId: string,
  structuredText: any
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('structured_notes')
      .insert({
        user_id: userId,
        transcription_id: transcriptionId,
        content: structuredText,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving structured text:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error saving structured text:', error);
    toast.error(error.message || 'Failed to save structured text.');
    throw error;
  }
};

/**
 * Gets structured text for a transcription
 */
export const getStructuredText = async (transcriptionId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('structured_notes')
      .select('*')
      .eq('transcription_id', transcriptionId)
      .single();

    if (error) {
      console.error('Error fetching structured text:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching structured text:', error);
    return null;
  }
};

/**
 * Gets the default template for a user
 */
export const getDefaultTemplate = async (userId: string): Promise<TextTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('text_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();
    
    if (error) {
      // If no default template exists, don't treat it as an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching default template:', error);
      throw error;
    }
    
    return mapToTextTemplate(data as TextTemplateResponse);
  } catch (error) {
    console.error('Error fetching default template:', error);
    return null;
  }
};
