
import React from 'react';
import DocumentView from '../../DocumentView';
import ExportButton from '../../buttons/ExportButton';
import { MedicalSections } from '../../types';

interface PrescriptionDocumentProps {
  structuredData: MedicalSections;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ structuredData }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportButton sections={structuredData} patientName={structuredData.patientInformation} />
      </div>
      <DocumentView structuredData={structuredData} />
    </div>
  );
};

export default PrescriptionDocument;
