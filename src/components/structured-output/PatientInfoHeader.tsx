
import React from 'react';

interface PatientInfoHeaderProps {
  patientName: string | null;
  patientId: string | null;
}

const PatientInfoHeader = ({ patientName, patientId }: PatientInfoHeaderProps) => {
  if (!patientName && !patientId) return null;
  
  return (
    <h2 className="text-xl font-bold mb-4">
      Medical Report {patientName ? 
        `for ${patientName}` : 
        patientId ? `(Patient ID: ${patientId})` : ''}
    </h2>
  );
};

export default PatientInfoHeader;
