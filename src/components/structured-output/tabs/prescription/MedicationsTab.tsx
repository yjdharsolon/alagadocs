
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
      
      // Log the structure of each medication for debugging
      medications.forEach((med, index) => {
        if (typeof med === 'object') {
          console.log(`Med ${index + 1} - Generic Name:`, med.genericName);
          console.log(`Med ${index + 1} - Brand name value:`, med.brandName);
          console.log(`Med ${index + 1} - Strength:`, med.strength);
          console.log(`Med ${index + 1} - Special Instructions:`, med.specialInstructions);
        } else {
          console.log(`Med ${index + 1} - Type:`, typeof med, 'Value:', med);
        }
      });
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
