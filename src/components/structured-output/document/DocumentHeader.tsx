
import React from 'react';
import { Separator } from '@/components/ui/separator';
import PatientInfoHeader from '../PatientInfoHeader';
import DocumentActions from '../DocumentActions';
import { MedicalSections } from '../types';

interface DocumentHeaderProps {
  patientInfo: {
    id: string | null;
    name: string | null;
    dateOfBirth?: string | null;
    age?: number | null;
    gender?: string | null;
  };
  structuredData: MedicalSections;
  structuredText: string;
  user: any;
  transcriptionId: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
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

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  patientInfo,
  structuredData,
  structuredText,
  user,
  transcriptionId,
  isEditMode,
  onToggleEditMode,
  onNoteSaved,
  onEndConsult,
  noteSaved = false,
  selectedFormats = [],
  refreshData,
  updateDataDirectly,
  disableRefreshAfterSave
}) => {
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
          structuredData={structuredData}
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
          disableRefreshAfterSave={disableRefreshAfterSave}
        />
      </div>
      
      <Separator className="my-4" />
    </>
  );
};

export default DocumentHeader;
