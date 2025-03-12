
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface AudioErrorProps {
  error: string;
  isLoading: boolean;
  is403Error: boolean;
  retryLoadingAudio: () => void;
  fixStoragePermissions: () => Promise<void>;
  checkStoragePolicies: () => Promise<void>;
  openDirectLink: () => void;
}

const AudioError: React.FC<AudioErrorProps> = ({
  error,
  isLoading,
  is403Error,
  retryLoadingAudio,
  fixStoragePermissions,
  checkStoragePolicies,
  openDirectLink
}) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
      <p className="text-sm text-red-800 mb-2">{error}</p>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={retryLoadingAudio}
          disabled={isLoading}
          className="text-xs"
        >
          <RefreshCw className="mr-1 h-3 w-3" /> Retry Loading
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fixStoragePermissions}
          disabled={isLoading}
          className="text-xs"
        >
          Fix Permissions
        </Button>
        {is403Error && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkStoragePolicies}
              disabled={isLoading}
              className="text-xs"
            >
              Check Policies
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openDirectLink}
              className="text-xs"
            >
              <ExternalLink className="mr-1 h-3 w-3" /> Open Direct Link
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioError;
