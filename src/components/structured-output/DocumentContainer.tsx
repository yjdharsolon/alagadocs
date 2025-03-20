import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import DocumentView from './DocumentView';
import EditableDocumentView from './EditableDocumentView';
import PatientInfoHeader from './PatientInfoHeader';
import DocumentActions from './DocumentActions';
import { MedicalSections } from './types';
import { getDocumentFormat, filterStructuredDataByFormat } from './tabs/TabUtils';

interface DocumentContainerProps {
  structuredData: MedicalSections;
  patientInfo: {
    id: string | null;
    name: string | null;
    dateOfBirth?: string | null;
    age?: number | null;
    gender?: string | null;
  };
  user: any;
  transcriptionId: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveEdit: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
  onNoteSaved?: () => void;
  onEndConsult?: () => void;
  noteSaved?: boolean;
  selectedFormats?: Array<{
    formatType: string;
    structuredData: MedicalSections;
  }>;
  refreshData?: () => void;
  updateDataDirectly?: (data: MedicalSections) => void;
  disableRefreshAfterSave?: boolean;
}

const DocumentContainer = ({
  structuredData,
  patientInfo,
  user,
  transcriptionId,
  isEditMode,
  onToggleEditMode,
  onSaveEdit,
  onNoteSaved,
  onEndConsult,
  noteSaved = false,
  selectedFormats = [],
  refreshData,
  updateDataDirectly,
  disableRefreshAfterSave = true
}: DocumentContainerProps) => {
  // Store a local copy of the latest data to ensure UI consistency
  const [localData, setLocalData] = useState<MedicalSections>(structuredData);
  
  // Update local data when structuredData changes
  useEffect(() => {
    console.log('[DocumentContainer] structuredData changed, updating local data');
    setLocalData(structuredData);
  }, [structuredData]);
  
  // Log medications whenever structuredData changes to track data flow
  useEffect(() => {
    if (structuredData && structuredData.medications) {
      console.log('[DocumentContainer] Current medications in structuredData:', 
        Array.isArray(structuredData.medications) 
          ? JSON.stringify(structuredData.medications, null, 2) 
          : structuredData.medications
      );
    }
  }, [structuredData]);
  
  // Log when component props change
  useEffect(() => {
    console.log('[DocumentContainer] Component received props update:', {
      hasStructuredData: !!structuredData,
      isEditMode,
      noteSaved,
      hasRefreshData: !!refreshData,
      hasUpdateDataDirectly: !!updateDataDirectly,
      disableRefreshAfterSave
    });
  }, [structuredData, isEditMode, noteSaved, refreshData, updateDataDirectly, disableRefreshAfterSave]);
  
  // Detect document format
  const documentFormat = getDocumentFormat(localData);
  
  // Filter data by format
  const filteredData = filterStructuredDataByFormat(localData, documentFormat);
  
  const getStructuredText = () => {
    return Object.entries(filteredData)
      .map(([key, value]) => {
        const title = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .toUpperCase();
        
        return `${title}:\n${value}\n`;
      })
      .join('\n');
  };

  const structuredText = getStructuredText();

  // Enhanced version that updates local state and optionally passes to parent
  const handleSaveEdit = (updatedData: MedicalSections, stayInEditMode?: boolean) => {
    console.log('[DocumentContainer] Received save with updatedData and stayInEditMode:', stayInEditMode);
    
    if (updatedData.medications) {
      console.log('[DocumentContainer] Updated medications:', 
        Array.isArray(updatedData.medications) 
          ? JSON.stringify(updatedData.medications, null, 2) 
          : updatedData.medications
      );
    }
    
    // Update local state immediately
    setLocalData(updatedData);
    
    // Track state before passing to parent handler
    console.log('[DocumentContainer] State before save:', {
      isEditMode,
      stayInEditMode,
      noteSaved,
      disableRefreshAfterSave: true
    });
    
    // Pass the stayInEditMode parameter to the parent's onSaveEdit
    onSaveEdit(updatedData, stayInEditMode);
    
    // If saving and exiting edit mode, call onNoteSaved to update state at the parent level
    if (!stayInEditMode && onNoteSaved) {
      console.log('[DocumentContainer] Exiting edit mode, calling onNoteSaved');
      onNoteSaved();
      
      // Use the direct update function to immediately update the UI
      if (updateDataDirectly) {
        console.log('[DocumentContainer] Directly updating UI with edited data');
        updateDataDirectly(updatedData);
      }
      
      // Skip refresh completely - we're forcing disableRefreshAfterSave to be true
      console.log('[DocumentContainer] Skipping background refresh after save - refresh is disabled');
    }
  };
  
  // Custom handler for direct UI updates
  const handleDirectUpdate = (updatedData: MedicalSections) => {
    console.log('[DocumentContainer] Direct update received');
    // Immediately update local state
    setLocalData(updatedData);
    
    // Also pass to parent if available
    if (updateDataDirectly) {
      updateDataDirectly(updatedData);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <PatientInfoHeader 
          patientName={patientInfo.name} 
          patientId={patientInfo.id}
          dateOfBirth={patientInfo.dateOfBirth}
          age={patientInfo.age}
          gender={patientInfo.gender}
        />
        
        <DocumentActions 
          user={user}
          structuredData={filteredData}
          structuredText={structuredText}
          transcriptionId={transcriptionId}
          patientInfo={patientInfo}
          isEditMode={isEditMode}
          onToggleEditMode={onToggleEditMode}
          onNoteSaved={onNoteSaved}
          onEndConsult={onEndConsult}
          noteSaved={noteSaved}
          selectedFormats={selectedFormats}
          refreshData={refreshData}
          updateDataDirectly={updateDataDirectly}
          disableRefreshAfterSave={true}
        />
      </div>
      
      <Separator className="my-4" />
      
      {isEditMode ? (
        <EditableDocumentView 
          structuredData={localData} 
          onSave={handleSaveEdit}
          updateDataDirectly={handleDirectUpdate}
        />
      ) : (
        <DocumentView structuredData={localData} />
      )}
    </>
  );
}

export default DocumentContainer;
