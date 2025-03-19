
import React from 'react';
import { MedicalSections } from './types';
import { getDocumentFormat } from './tabs/TabUtils';
import ConsultationTabs from './tabs/ConsultationTabs';
import PrescriptionTabs from './tabs/PrescriptionTabs';
import SoapTabs from './tabs/SoapTabs';
import StandardTabs from './tabs/StandardTabs';

interface DocumentTabsProps {
  structuredData: MedicalSections;
}

const DocumentTabs = ({ structuredData }: DocumentTabsProps) => {
  const documentFormat = getDocumentFormat(structuredData);
  
  // Render different tab sets based on document format
  switch (documentFormat) {
    case 'consultation':
      return <ConsultationTabs structuredData={structuredData} />;
    case 'prescription':
      return <PrescriptionTabs structuredData={structuredData} />;
    case 'soap':
      return <SoapTabs structuredData={structuredData} />;
    default:
      // Standard format
      return <StandardTabs structuredData={structuredData} />;
  }
};

export default DocumentTabs;
