
import React from 'react';
import DocumentView from '../../DocumentView';
import ExportButton from '../../buttons/ExportButton';
import { MedicalSections } from '../../types';
import { formatPrescriptionForExport } from '../../utils/exportUtils';

interface PrescriptionDocumentProps {
  structuredData: MedicalSections;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ structuredData }) => {
  // Extract patient name from the patient information object
  const patientName = structuredData.patientInformation?.name || null;
  
  // Format data for export
  const exportData = formatPrescriptionForExport(structuredData);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportButton sections={exportData} patientName={patientName} />
      </div>
      <DocumentView structuredData={structuredData} />
    </div>
  );
};

export default PrescriptionDocument;
