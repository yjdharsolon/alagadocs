
import { supabase } from '@/integrations/supabase/client';

/**
 * Initializes the application by setting up required resources
 */
export const initializeApp = async (): Promise<void> => {
  try {
    // Create the transcriptions storage bucket if it doesn't exist
    await supabase.functions.invoke('create-bucket');
    console.log('Storage setup completed');
  } catch (error) {
    console.error('Error initializing app:', error);
    // Don't throw here, as the app can still function even if this fails
  }
};
