
import React from 'react';
import DocumentView from '../../DocumentView';
import ExportButton from '../../buttons/ExportButton';
import { MedicalSections } from '../../types';
import { formatPrescriptionForExport } from '../../utils/exportUtils';
import { useProfileFields } from '@/hooks/useProfileFields';

interface PrescriptionDocumentProps {
  structuredData: MedicalSections;
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ structuredData }) => {
  // Get doctor profile information
  const { profileData } = useProfileFields();
  
  // Extract patient name from the patient information object
  const patientName = typeof structuredData.patientInformation === 'object' 
    ? structuredData.patientInformation?.name || null
    : null;
  
  // Format data for export
  const exportData = formatPrescriptionForExport(structuredData);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ExportButton 
          sections={exportData} 
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
