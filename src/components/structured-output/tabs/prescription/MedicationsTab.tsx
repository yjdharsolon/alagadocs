
import React from 'react';
import SectionContent from '../../SectionContent';
import { formatContent } from '../TabUtils';
import { formatMedications } from './formatUtils';

interface MedicationsTabProps {
  medications: any;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ medications }) => {
  return (
    <SectionContent 
      title="MEDICATIONS" 
      content={
        Array.isArray(medications)
          ? formatMedications(medications)
          : formatContent(medications)
      } 
    />
  );
};

export default MedicationsTab;
