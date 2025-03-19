
import React from 'react';
import SectionContent from '../../SectionContent';
import { MedicalSections } from '../../types';
import { formatContent } from '../TabUtils';

interface PatientInfoTabProps {
  patientInformation: any;
}

const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ patientInformation }) => {
  // Format patient information for display
  const formattedInfo = typeof patientInformation === 'string' 
    ? patientInformation 
    : formatContent(patientInformation);
    
  return (
    <SectionContent 
      title="PATIENT INFORMATION" 
      content={formattedInfo} 
    />
  );
};

export default PatientInfoTab;
