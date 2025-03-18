
import React from 'react';
import { MedicalSections } from './types';
import DocumentContainer from './DocumentContainer';
import LoadingState from './LoadingState';
import NoDataView from './NoDataView';
import FormatTypeSelector from '../transcription/FormatTypeSelector';

interface StructuredOutputContentProps {
  loading: boolean;
  processingText: boolean;
  structuredData: MedicalSections | null;
  error: string | null;
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
  onSaveEdit: (updatedData: MedicalSections) => void;
  onRetry: () => void;
  onNoteSaved: () => void;
  onEndConsult: () => void;
  noteSaved: boolean;
  formattedVersions?: Array<{ formatType: string; formattedText: string; }>;
  activeFormatType?: string;
  onFormatTypeChange?: (formatType: string) => void;
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
  onEndConsult,
  noteSaved,
  formattedVersions = [],
  activeFormatType = '',
  onFormatTypeChange
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

  // Format types for selector
  const formatTypes = formattedVersions.map(v => ({
    id: v.formatType,
    name: v.formatType === 'history' ? 'History & Physical' : 
          v.formatType === 'consultation' ? 'Consultation' :
          v.formatType === 'prescription' ? 'Prescription' : v.formatType
  }));

  return (
    <div>
      {formattedVersions.length > 0 && onFormatTypeChange && (
        <div className="mb-4">
          <FormatTypeSelector
            formatType={activeFormatType}
            onFormatTypeChange={onFormatTypeChange}
            formatTypes={formatTypes}
            autoFormat={false}
          />
        </div>
      )}
      
      <DocumentContainer 
        structuredData={structuredData}
        patientInfo={patientInfo}
        user={user}
        transcriptionId={transcriptionId || ''}
        isEditMode={isEditMode}
        onToggleEditMode={onToggleEditMode}
        onSaveEdit={onSaveEdit}
        onNoteSaved={onNoteSaved}
        onEndConsult={onEndConsult}
        noteSaved={noteSaved}
      />
    </div>
  );
};

export default StructuredOutputContent;
