
import React, { useEffect } from 'react';
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
  updateDataDirectly
}: DocumentContainerProps) => {
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
  
  // Detect document format
  const documentFormat = getDocumentFormat(structuredData);
  
  // Filter data by format
  const filteredData = filterStructuredDataByFormat(structuredData, documentFormat);
  
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

  const handleSaveEdit = (updatedData: MedicalSections, stayInEditMode?: boolean) => {
    console.log('[DocumentContainer] Received save with updatedData and stayInEditMode:', stayInEditMode);
    
    if (updatedData.medications) {
      console.log('[DocumentContainer] Updated medications:', 
        Array.isArray(updatedData.medications) 
          ? JSON.stringify(updatedData.medications, null, 2) 
          : updatedData.medications
      );
    }
    
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
      
      // Still perform the normal refresh as a backup
      if (refreshData) {
        console.log('[DocumentContainer] Scheduling background refresh after save');
        setTimeout(() => {
          refreshData();
          console.log('[DocumentContainer] Background refresh completed');
        }, 200);
      }
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
        />
      </div>
      
      <Separator className="my-4" />
      
      {isEditMode ? (
        <EditableDocumentView 
          structuredData={structuredData} 
          onSave={handleSaveEdit}
        />
      ) : (
        <DocumentView structuredData={structuredData} />
      )}
    </>
  );
}

export default DocumentContainer;
