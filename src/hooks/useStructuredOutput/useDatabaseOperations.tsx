
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { saveStructuredNote } from '@/services/structuredNote/saveNote';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface UseDatabaseOperationsParams {
  transcriptionId?: string;
  patientId?: string | null;
}

/**
 * Hook to manage database save operations
 */
export const useDatabaseOperations = ({ 
  transcriptionId, 
  patientId 
}: UseDatabaseOperationsParams) => {
  const { user } = useAuth();
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  /**
   * Save data to the database in the background
   */
  const saveToDatabase = async (dataToSave: MedicalSections) => {
    if (!transcriptionId || !user?.id) {
      console.log('[useDatabaseOperations] Not saving to database - missing transcriptionId or user.id');
      return;
    }
    
    if (saveInProgress) {
      console.log('[useDatabaseOperations] Save operation already in progress, skipping.');
      return;
    }
    
    setSaveInProgress(true);
    
    try {
      console.log('[useDatabaseOperations] Starting database save (in background)...');
      
      // Use a setTimeout to ensure UI updates happen first
      setTimeout(async () => {
        try {
          const saveResult = await saveStructuredNote(
            user.id,
            transcriptionId,
            dataToSave,
            patientId
          );
          console.log('[useDatabaseOperations] Background save result:', saveResult);
          toast.success('Document saved to database successfully');
        } catch (error) {
          console.error('Error in background save:', error);
          toast.error('Warning: Changes saved to screen but database update failed');
        } finally {
          setSaveInProgress(false);
        }
      }, 0);
    } catch (error) {
      console.error('[useDatabaseOperations] Error setting up background save:', error);
      setSaveInProgress(false);
    }
  };
  
  return {
    saveInProgress,
    saveToDatabase
  };
};
