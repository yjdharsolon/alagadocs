
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets policies for a specific table for debugging purposes
 * @param tableName The name of the table to get policies for
 * @returns The policies for the table
 */
export const getPoliciesForTable = async (tableName: string): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('get_policies_for_table', { table_name: tableName });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting policies:', error);
    return null;
  }
};
