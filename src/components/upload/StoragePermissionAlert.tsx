
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoragePermissionAlertProps {
  error: string | null;
  onRetry: () => void;
  onFixPermissions: () => void;
  retrying: boolean;
  fixingPermissions: boolean;
}

export const StoragePermissionAlert: React.FC<StoragePermissionAlertProps> = ({
  error,
  onRetry,
  onFixPermissions,
  retrying,
  fixingPermissions
}) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <span>{error}</span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            disabled={retrying}
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onFixPermissions}
            disabled={fixingPermissions}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${fixingPermissions ? 'animate-spin' : ''}`} />
            {fixingPermissions ? 'Fixing...' : 'Fix Permissions'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
