
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
      
      // Log each medication for debugging
      medications.forEach((med, index) => {
        if (typeof med === 'object') {
          console.log(`Med ${index + 1} - Generic Name:`, med.genericName);
          console.log(`Med ${index + 1} - Brand name property exists:`, 'brandName' in med);
          console.log(`Med ${index + 1} - Brand name value:`, med.brandName);
          console.log(`Med ${index + 1} - Strength:`, med.strength);
        } else {
          console.log(`Med ${index + 1} - Type:`, typeof med, 'Value:', med);
        }
      });
    } else {
      console.log('Medications is not an array, type:', typeof medications);
    }
  }, [medications]);
  
  // Process medications before rendering if needed
  const processedMedications = React.useMemo(() => {
    if (!Array.isArray(medications)) return medications;
    
    // No additional processing needed here as formatMedications handles it
    return medications;
  }, [medications]);

  return (
    <SectionContent 
      title="MEDICATIONS" 
      content={
        Array.isArray(processedMedications)
          ? formatMedications(processedMedications)
          : formatContent(processedMedications)
      } 
    />
  );
};

export default MedicationsTab;
