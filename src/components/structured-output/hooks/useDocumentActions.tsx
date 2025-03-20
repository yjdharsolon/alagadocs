
import { useState } from 'react';
import { MedicalSections } from '../types';

interface UseDocumentActionsProps {
  onSaveEdit: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
  onNoteSaved?: () => void;
  updateDataDirectly?: (data: MedicalSections) => void;
}

/**
 * Hook to manage document editing and saving actions
 */
export const useDocumentActions = ({
  onSaveEdit,
  onNoteSaved,
  updateDataDirectly
}: UseDocumentActionsProps) => {
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);

  // Enhanced version that updates local state and optionally passes to parent
  const handleSaveEdit = (updatedData: MedicalSections, stayInEditMode?: boolean) => {
    console.log('[useDocumentActions] Received save with updatedData and stayInEditMode:', stayInEditMode);
    
    if (updatedData.medications) {
      console.log('[useDocumentActions] Updated medications:', 
        Array.isArray(updatedData.medications) 
          ? JSON.stringify(updatedData.medications, null, 2) 
          : updatedData.medications
      );
    }
    
    // Track state before passing to parent handler
    console.log('[useDocumentActions] State before save:', {
      stayInEditMode,
      disableRefreshAfterSave: true
    });
    
    // Pass the stayInEditMode parameter to the parent's onSaveEdit
    onSaveEdit(updatedData, stayInEditMode);
    
    // If saving and exiting edit mode, call onNoteSaved to update state at the parent level
    if (!stayInEditMode && onNoteSaved) {
      console.log('[useDocumentActions] Exiting edit mode, calling onNoteSaved');
      onNoteSaved();
      
      // Use the direct update function to immediately update the UI
      if (updateDataDirectly) {
        console.log('[useDocumentActions] Directly updating UI with edited data');
        updateDataDirectly(updatedData);
      }
      
      // Skip refresh completely - we're forcing disableRefreshAfterSave to be true
      console.log('[useDocumentActions] Skipping background refresh after save - refresh is disabled');
    }
  };
  
  // Custom handler for direct UI updates
  const handleDirectUpdate = (updatedData: MedicalSections) => {
    console.log('[useDocumentActions] Direct update received');
    
    // Also pass to parent if available
    if (updateDataDirectly) {
      updateDataDirectly(updatedData);
    }
  };

  return {
    currentlyEditingId,
    setCurrentlyEditingId,
    handleSaveEdit,
    handleDirectUpdate
  };
};
