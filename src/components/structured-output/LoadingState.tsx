
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const LoadingState = ({ 
  message = "Loading...", 
  subMessage 
}: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-[#33C3F0] mb-4" />
      <p className="text-lg font-medium text-center">{message}</p>
      {subMessage && (
        <p className="text-sm text-center text-muted-foreground mt-2 max-w-md">{subMessage}</p>
      )}
      <div className="mt-6 max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#33C3F0] animate-pulse rounded-full w-3/4"></div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">This may take a minute or two, please don't close this page</p>
      </div>
    </div>
  );
};

export default LoadingState;
