
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlingParams {
  handleRetry: () => void;
}

export const useErrorHandling = ({ 
  handleRetry 
}: UseErrorHandlingParams) => {
  
  const handleError = useCallback((error: string) => {
    console.error('Error encountered:', error);
    toast.error(error || 'An unexpected error occurred');
  }, []);

  const retryProcessing = useCallback(() => {
    handleRetry();
  }, [handleRetry]);

  return {
    handleError,
    retryProcessing
  };
};
