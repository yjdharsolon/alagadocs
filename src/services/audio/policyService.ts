
import { supabase } from '@/integrations/supabase/client';

interface PolicyInfo {
  schema: string;
  table_name: string;
  policy_name: string;
  action: string;
  roles: string[];
  definition: string;
  check_clause: string;
}

interface GetPoliciesParams {
  p_table_name: string;
}

/**
 * Gets the RLS policies for a table to help diagnose permissions issues
 * @param tableName The name of the table to get policies for
 * @returns Information about the policies on the table
 */
export const getPoliciesForTable = async (tableName: string): Promise<PolicyInfo[] | null> => {
  try {
    const params: GetPoliciesParams = {
      p_table_name: tableName
    };

    // Fix: properly specify the generic types for the rpc method
    const { data, error } = await supabase.rpc('get_policies_for_table', params);
    
    if (error) {
      console.error(`Error getting policies for table ${tableName}:`, error);
      return null;
    }
    
    // Ensure we're casting the data to the correct type
    return data as PolicyInfo[];
  } catch (error) {
    console.error('Error in getPoliciesForTable:', error);
    return null;
  }
};
