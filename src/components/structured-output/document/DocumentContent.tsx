
import React from 'react';
import { MedicalSections } from '../types';
import DocumentView from '../DocumentView';
import EditableDocumentView from '../EditableDocumentView';

interface DocumentContentProps {
  isEditMode: boolean;
  localData: MedicalSections;
  onSaveEdit: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
  handleDirectUpdate: (data: MedicalSections) => void;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  isEditMode,
  localData,
  onSaveEdit,
  handleDirectUpdate
}) => {
  return (
    <>
      {isEditMode ? (
        <EditableDocumentView 
          structuredData={localData} 
          onSave={onSaveEdit}
          updateDataDirectly={handleDirectUpdate}
        />
      ) : (
        <DocumentView structuredData={localData} />
      )}
    </>
  );
};

export default DocumentContent;
