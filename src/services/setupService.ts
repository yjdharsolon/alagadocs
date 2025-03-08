
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

export const initializeApp = async () => {
  try {
    // Initialize the storage bucket
    const { error } = await supabase.functions.invoke('create-storage-bucket');
    
    if (error) {
      console.error('Error initializing storage:', error);
    }
  } catch (error) {
    console.error('Setup service error:', error);
  }
};
