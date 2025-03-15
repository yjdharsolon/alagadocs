
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlingParams {
  error: string | null;
  handleRetry: () => boolean;
}

export const useErrorHandling = ({ 
  error, 
  handleRetry 
}: UseErrorHandlingParams) => {
  
  const retryProcessing = useCallback(() => {
    if (!handleRetry()) {
      toast.error('No transcription data available');
    }
  }, [handleRetry]);

  return {
    error,
    retryProcessing
  };
};
