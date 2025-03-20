
import React from 'react';
import SectionContent from '../../SectionContent';
import { formatContent } from '../TabUtils';
import { formatMedications } from './formatUtils';

interface MedicationsTabProps {
  medications: any;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ medications }) => {
  // Add debugging to check what medication data we're receiving
  React.useEffect(() => {
    console.log('MedicationsTab received medications:', medications);
    // Check if it's an array of objects or strings
    if (Array.isArray(medications)) {
      console.log('Medications is an array with length:', medications.length);
      if (medications.length > 0) {
        console.log('First medication type:', typeof medications[0]);
        console.log('First medication data:', medications[0]);
      }
    } else {
      console.log('Medications is not an array, type:', typeof medications);
    }
  }, [medications]);

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
