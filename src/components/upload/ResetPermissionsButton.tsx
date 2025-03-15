
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResetPermissionsButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ResetPermissionsButton: React.FC<ResetPermissionsButtonProps> = ({ 
  onClick, 
  isLoading 
}) => {
  return (
    <div className="mt-2 flex justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Fixing...' : 'Reset Permissions'}
      </Button>
    </div>
  );
};
