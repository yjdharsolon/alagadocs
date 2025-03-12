
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getPoliciesForTable } from '@/services/audio/policyService';

interface UsePermissionFixerResult {
  fixStoragePermissions: () => Promise<void>;
  checkStoragePolicies: () => Promise<void>;
  retryLoadingAudio: () => void;
  retryCount: number;
}

export const usePermissionFixer = (): UsePermissionFixerResult => {
  const [retryCount, setRetryCount] = useState(0);

  const retryLoadingAudio = useCallback(() => {
    setRetryCount(prev => prev + 1);
    toast("Retrying audio load...");
  }, []);

  const fixStoragePermissions = useCallback(async () => {
    try {
      toast.loading('Fixing storage permissions...');
      
      const { data, error } = await supabase.functions.invoke('fix-storage-permissions');
      
      if (error) {
        console.error('Error fixing storage permissions:', error);
        toast.error('Failed to fix permissions');
      } else {
        console.log('Storage permissions fixed:', data);
        toast.success('Storage permissions fixed! Retrying audio...');
        setRetryCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error fixing permissions:', err);
      toast.error('Failed to fix permissions');
    }
  }, []);

  const checkStoragePolicies = useCallback(async () => {
    try {
      toast.loading('Checking storage policies...');
      
      const policies = await getPoliciesForTable('objects');
      console.log('Storage policies:', policies);
      
      if (policies && policies.length > 0) {
        toast.success(`Found ${policies.length} policies`);
      } else {
        toast.error('No storage policies found. Please fix permissions.');
      }
    } catch (err) {
      console.error('Error checking policies:', err);
      toast.error('Error checking policies. Please try fixing permissions.');
    }
  }, []);

  return {
    fixStoragePermissions,
    checkStoragePolicies,
    retryLoadingAudio,
    retryCount
  };
};
