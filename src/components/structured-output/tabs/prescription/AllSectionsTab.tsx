
import React from 'react';
import SectionContent from '../../SectionContent';
import { MedicalSections } from '../../types';
import { formatContent } from '../TabUtils';
import { formatMedications, formatPrescriberInfo } from './formatUtils';

interface AllSectionsTabProps {
  structuredData: MedicalSections;
  prescriberInfo: any;
}

const AllSectionsTab: React.FC<AllSectionsTabProps> = ({ 
  structuredData, 
  prescriberInfo 
}) => {
  return (
    <div className="space-y-6">
      <SectionContent 
        title="PATIENT INFORMATION" 
        content={formatContent(structuredData.patientInformation)} 
      />
      <SectionContent 
        title="MEDICATIONS" 
        content={
          Array.isArray(structuredData.medications)
            ? formatMedications(structuredData.medications)
            : formatContent(structuredData.medications)
        } 
      />
      <SectionContent 
        title="PRESCRIBER INFORMATION" 
        content={formatPrescriberInfo(prescriberInfo, structuredData.prescriberInformation)}
      />
    </div>
  );
};

export default AllSectionsTab;
