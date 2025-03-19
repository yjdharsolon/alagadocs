
import React from 'react';
import SectionContent from '../../SectionContent';
import { MedicalSections } from '../../types';
import { formatContent } from '../TabUtils';

interface PatientInfoTabProps {
  patientInformation: any;
}

const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ patientInformation }) => {
  return (
    <SectionContent 
      title="PATIENT INFORMATION" 
      content={formatContent(patientInformation)} 
    />
  );
};

export default PatientInfoTab;
