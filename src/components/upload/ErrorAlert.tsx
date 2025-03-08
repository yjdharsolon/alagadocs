
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ErrorAlertProps {
  error: string;
  onLogoutAndLogin: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onLogoutAndLogin }) => {
  // Check if the error is related to permissions or authentication
  const isPermissionError = error.toLowerCase().includes('permission error') || 
                           error.toLowerCase().includes('row-level security policy') || 
                           error.toLowerCase().includes('authentication error');
  
  const handleLogout = async () => {
    try {
      await onLogoutAndLogin();
      toast.success('Successfully logged out. Please log in again.');
    } catch (err) {
      console.error('Error during logout:', err);
      toast.error('Error during logout. Please try again.');
    }
  };
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <span>{error}</span>
        {isPermissionError && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleLogout}
            className="mt-2 sm:mt-0"
          >
            Logout and Login Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
