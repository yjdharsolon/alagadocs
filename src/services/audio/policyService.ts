
import { supabase } from '@/integrations/supabase/client';

interface PolicyInfo {
  schema: string;
  table: string;
  policy_name: string;
  action: string;
  roles: string[];
  definition: string;
  check: string | null;
}

type GetPoliciesParams = {
  p_table_name: string;
};

/**
 * Gets the RLS policies for a table to help diagnose permissions issues
 * @param tableName The name of the table to get policies for
 * @returns Information about the policies on the table
 */
export const getPoliciesForTable = async (tableName: string): Promise<PolicyInfo[] | null> => {
  try {
    // This requires admin privileges, so it will generally fail for regular users
    // It's mainly included for debugging during development
    const params: GetPoliciesParams = {
      p_table_name: tableName
    };

    const { data, error } = await supabase.rpc<PolicyInfo[]>(
      'get_policies_for_table',
      params
    );
    
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
