
import React, { useState } from 'react';
import { MedicalSections } from './types';
import DocumentContainer from './DocumentContainer';
import NoDataView from './NoDataView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FormatSelectionTab from './FormatSelectionTab';
import { filterStructuredDataByFormat } from './tabs/TabUtils';

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
  formattedVersions?: Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>;
  activeFormatType?: string;
  onFormatTypeChange?: (formatType: string) => void;
  onToggleFormatSelection?: (formatType: string) => void;
  refreshData?: () => void;
  updateDataDirectly?: (data: MedicalSections) => void;
}

const StructuredOutputContent: React.FC<StructuredOutputContentProps> = ({
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
  onFormatTypeChange,
  onToggleFormatSelection,
  refreshData,
  updateDataDirectly
}) => {
  // The loading states are now handled at the page level, 
  // so this component only needs to handle the data or error cases
  
  if (!structuredData) {
    return <NoDataView error={error} onRetry={onRetry} />;
  }

  const getFormatDisplayName = (formatType: string) => {
    switch (formatType) {
      case 'history': return 'History & Physical';
      case 'consultation': return 'Consultation';
      case 'prescription': return 'Prescription';
      case 'soap': return 'SOAP Note';
      default: return formatType.charAt(0).toUpperCase() + formatType.slice(1);
    }
  };

  // Get selected formats for saving, and filter each one by format
  const selectedFormats = formattedVersions
    .filter(format => format.selected)
    .map(format => ({
      formatType: format.formatType,
      structuredData: filterStructuredDataByFormat(
        format.structuredData, 
        format.formatType as 'standard' | 'soap' | 'consultation' | 'prescription'
      )
    }));

  return (
    <div>
      {formattedVersions.length > 0 && onFormatTypeChange && (
        <Tabs defaultValue={activeFormatType || formattedVersions[0].formatType} value={activeFormatType} onValueChange={onFormatTypeChange} className="mb-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${formattedVersions.length + 1}, 1fr)` }}>
            {formattedVersions.map(format => (
              <TabsTrigger key={format.formatType} value={format.formatType}>
                {getFormatDisplayName(format.formatType)}
              </TabsTrigger>
            ))}
            <TabsTrigger value="selection">Selection</TabsTrigger>
          </TabsList>
          
          {formattedVersions.map(format => {
            // Filter data to only include fields relevant to this format
            const filteredData = filterStructuredDataByFormat(
              format.structuredData,
              format.formatType as 'standard' | 'soap' | 'consultation' | 'prescription'
            );
            
            return (
              <TabsContent key={format.formatType} value={format.formatType} className="mt-4">
                <DocumentContainer 
                  structuredData={filteredData}
                  patientInfo={patientInfo}
                  user={user}
                  transcriptionId={transcriptionId || ''}
                  isEditMode={isEditMode}
                  onToggleEditMode={onToggleEditMode}
                  onSaveEdit={onSaveEdit}
                  onNoteSaved={onNoteSaved}
                  onEndConsult={onEndConsult}
                  noteSaved={noteSaved}
                  selectedFormats={selectedFormats}
                  refreshData={refreshData}
                  updateDataDirectly={updateDataDirectly}
                />
              </TabsContent>
            );
          })}
          
          <TabsContent value="selection" className="mt-4">
            {onToggleFormatSelection && (
              <FormatSelectionTab 
                formats={formattedVersions}
                onToggleSelection={onToggleFormatSelection}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Fallback when no formattedVersions available */}
      {formattedVersions.length === 0 && (
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
          refreshData={refreshData}
          updateDataDirectly={updateDataDirectly}
        />
      )}
    </div>
  );
};

export default StructuredOutputContent;
