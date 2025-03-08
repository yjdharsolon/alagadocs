
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  error: string;
  onLogoutAndLogin: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onLogoutAndLogin }) => {
  const isPermissionError = error.includes('Permission error');
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <span>{error}</span>
        {isPermissionError && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onLogoutAndLogin}
            className="mt-2 sm:mt-0"
          >
            Logout and Login Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
