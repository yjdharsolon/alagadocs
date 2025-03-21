
import React, { useEffect } from 'react';
import DocumentView from '../../DocumentView';
import ExportButton from '../../buttons/ExportButton';
import { MedicalSections } from '../../types';
import { formatPrescriptionForExport } from '../../utils/exportUtils';
import { useProfileFields } from '@/hooks/useProfileFields';

interface PrescriptionDocumentProps {
  structuredData: MedicalSections;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ structuredData }) => {
  // Get doctor profile information for the PDF header and footer
  const { profileData } = useProfileFields();
  
  // Log data for debugging
  useEffect(() => {
    console.log('PrescriptionDocument debugging:');
    console.log('- structuredData:', JSON.stringify(structuredData, null, 2));
    console.log('- profileData:', profileData ? JSON.stringify(profileData, null, 2) : 'No profile data');
  }, [structuredData, profileData]);
  
  // Extract patient name from the patient information object
  const patientName = typeof structuredData.patientInformation === 'object' 
    ? structuredData.patientInformation?.name || null
    : structuredData.patientInformation || null;
  
  console.log('DEBUG: Extracted patientName:', patientName);
  
  // Format data for export
  const formattedData = formatPrescriptionForExport(structuredData);
  console.log('DEBUG: Formatted prescription data:', formattedData);
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportButton 
          sections={formattedData} 
          patientName={patientName} 
          profileData={profileData}
          isPrescription={true}
        />
      </div>
      <DocumentView structuredData={structuredData} />
    </div>
  );
};

export default PrescriptionDocument;
