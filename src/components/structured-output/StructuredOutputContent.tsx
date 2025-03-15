
import React from 'react';
import { MedicalSections } from './types';
import DocumentContainer from './DocumentContainer';
import LoadingState from './LoadingState';
import NoDataView from './NoDataView';

interface StructuredOutputContentProps {
  loading: boolean;
  processingText: boolean;
  structuredData: MedicalSections | null;
  error: string | null;
  patientInfo: {
    id: string | null;
    name: string | null;
  };
  user: any;
  transcriptionId: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveEdit: (updatedData: MedicalSections) => void;
  onRetry: () => void;
  onNoteSaved: () => void;
  noteSaved: boolean;
}

const StructuredOutputContent: React.FC<StructuredOutputContentProps> = ({
  loading,
  processingText,
  structuredData,
  error,
  patientInfo,
  user,
  transcriptionId,
  isEditMode,
  onToggleEditMode,
  onSaveEdit,
  onRetry,
  onNoteSaved,
  noteSaved
}) => {
  if (loading) {
    return (
      <LoadingState 
        message={processingText ? "Processing transcription..." : "Loading structured data..."} 
        subMessage={processingText ? "Converting your transcription into structured medical notes. This may take a moment." : undefined}
      />
    );
  }

  if (!structuredData) {
    return <NoDataView error={error} onRetry={onRetry} />;
  }

  return (
    <DocumentContainer 
      structuredData={structuredData}
      patientInfo={patientInfo}
      user={user}
      transcriptionId={transcriptionId || ''}
      isEditMode={isEditMode}
      onToggleEditMode={onToggleEditMode}
      onSaveEdit={onSaveEdit}
      onNoteSaved={onNoteSaved}
      noteSaved={noteSaved}
    />
  );
};

export default StructuredOutputContent;
