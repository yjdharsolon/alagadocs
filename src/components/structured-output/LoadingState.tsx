
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
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-center text-muted-foreground">{message}</p>
      {subMessage && (
        <p className="text-sm text-center text-muted-foreground mt-2 max-w-md">{subMessage}</p>
      )}
    </div>
  );
};

export default LoadingState;
