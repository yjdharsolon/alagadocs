
import React from 'react';
import DocumentView from '../../DocumentView';
import { MedicalSections } from '../../types';

interface PrescriptionDocumentProps {
  structuredData: MedicalSections;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ structuredData }) => {
  return <DocumentView structuredData={structuredData} />;
};

export default PrescriptionDocument;
