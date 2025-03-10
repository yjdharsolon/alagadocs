
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the RLS policies for a table to help diagnose permissions issues
 * @param tableName The name of the table to get policies for
 * @returns Information about the policies on the table
 */
export const getPoliciesForTable = async (tableName: string): Promise<any> => {
  try {
    // This requires admin privileges, so it will generally fail for regular users
    // It's mainly included for debugging during development
    const { data, error } = await supabase.rpc('get_policies_for_table', {
      p_table_name: tableName 
    } as { p_table_name: string });
    
    if (error) {
      console.error(`Error getting policies for table ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPoliciesForTable:', error);
    return null;
  }
};
