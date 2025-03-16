
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoragePermissionAlert } from './StoragePermissionAlert';
import { ResetPermissionsButton } from './ResetPermissionsButton';
import toast from 'react-hot-toast';

interface PermissionsManagerProps {
  error: string | null;
  setError: (error: string | null) => void;
  showResetButton?: boolean;
  onRetryInit?: () => void;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  error, 
  setError,
  showResetButton = true,
  onRetryInit
}) => {
  const [fixingPermissions, setFixingPermissions] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const fixPermissions = async () => {
    try {
      setFixingPermissions(true);
      setError(null);
      
      // Call our edge function to fix storage permissions
      const { data, error } = await supabase.functions.invoke('fix-storage-permissions');
      
      if (error) {
        console.error('Error fixing storage permissions:', error);
        setError('Could not fix permissions. Please try again or contact support.');
        toast.error('Failed to fix permissions');
      } else {
        console.log('Fix permissions response:', data);
        toast.success('Storage permissions fixed! Please try uploading again.');
      }
    } catch (err) {
      console.error('Error fixing permissions:', err);
      setError('Error fixing permissions. Please try again.');
      toast.error('Failed to fix permissions');
    } finally {
      setFixingPermissions(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    if (onRetryInit) {
      await onRetryInit();
    }
    setRetrying(false);
    toast.success('Storage initialization attempted again');
  };

  return (
    <>
      <StoragePermissionAlert 
        error={error}
        onRetry={handleRetry}
        onFixPermissions={fixPermissions}
        retrying={retrying}
        fixingPermissions={fixingPermissions}
      />
      
      {!error && showResetButton && (
        <ResetPermissionsButton 
          onClick={fixPermissions} 
          isLoading={fixingPermissions} 
        />
      )}
    </>
  );
};
