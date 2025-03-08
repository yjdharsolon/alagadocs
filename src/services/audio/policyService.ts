
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the RLS policies for a table
 * @param tableName The name of the table to get policies for
 * @returns A list of policies or null if an error occurs
 */
export const getPoliciesForTable = async (tableName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('check-rls-policies', {
      body: { tableName }
    });
    
    if (error) {
      console.error('Error fetching policies:', error);
      return null;
    }
    
    return data?.policies || null;
  } catch (error) {
    console.error('Error in getPoliciesForTable:', error);
    return null;
  }
};
