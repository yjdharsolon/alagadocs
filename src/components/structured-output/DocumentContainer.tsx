
import React, { useEffect } from 'react';
import { MedicalSections } from './types';
import { useDocumentData } from './hooks/useDocumentData';
import { useDocumentActions } from './hooks/useDocumentActions';
import DocumentHeader from './document/DocumentHeader';
import DocumentContent from './document/DocumentContent';

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
  // Use the document data hook to manage document data and format
  const {
    localData,
    setLocalData,
    documentFormat,
    filteredData,
    getStructuredText
  } = useDocumentData(structuredData);
  
  // Use the document actions hook to manage document editing and saving
  const {
    handleSaveEdit,
    handleDirectUpdate
  } = useDocumentActions({
    onSaveEdit,
    onNoteSaved,
    updateDataDirectly
  });
  
  // Log component initialization
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

  const structuredText = getStructuredText();

  return (
    <>
      <DocumentHeader
        patientInfo={patientInfo}
        structuredData={filteredData}
        structuredText={structuredText}
        user={user}
        transcriptionId={transcriptionId}
        isEditMode={isEditMode}
        onToggleEditMode={onToggleEditMode}
        onNoteSaved={onNoteSaved}
        onEndConsult={onEndConsult}
        noteSaved={noteSaved}
        selectedFormats={selectedFormats}
        refreshData={refreshData}
        updateDataDirectly={updateDataDirectly}
        disableRefreshAfterSave={disableRefreshAfterSave}
      />
      
      <DocumentContent
        isEditMode={isEditMode}
        localData={localData}
        onSaveEdit={handleSaveEdit}
        handleDirectUpdate={handleDirectUpdate}
      />
    </>
  );
}

export default DocumentContainer;
