
import React from 'react';
import { Separator } from '@/components/ui/separator';
import DocumentView from './DocumentView';
import EditableDocumentView from './EditableDocumentView';
import PatientInfoHeader from './PatientInfoHeader';
import DocumentActions from './DocumentActions';
import { MedicalSections } from './types';

interface DocumentContainerProps {
  structuredData: MedicalSections;
  patientInfo: {
    id: string | null;
    name: string | null;
  };
  user: any;
  transcriptionId: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveEdit: (updatedData: MedicalSections) => void;
}

const DocumentContainer = ({
  structuredData,
  patientInfo,
  user,
  transcriptionId,
  isEditMode,
  onToggleEditMode,
  onSaveEdit
}: DocumentContainerProps) => {
  const getStructuredText = () => {
    return Object.entries(structuredData)
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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <PatientInfoHeader 
          patientName={patientInfo.name} 
          patientId={patientInfo.id} 
        />
        
        <DocumentActions 
          user={user}
          structuredData={structuredData}
          structuredText={structuredText}
          transcriptionId={transcriptionId}
          patientInfo={patientInfo}
          isEditMode={isEditMode}
          onToggleEditMode={onToggleEditMode}
        />
      </div>
      
      <Separator className="my-4" />
      
      {isEditMode ? (
        <EditableDocumentView 
          structuredData={structuredData} 
          onSave={onSaveEdit}
        />
      ) : (
        <DocumentView structuredData={structuredData} />
      )}
    </>
  );
};

export default DocumentContainer;
