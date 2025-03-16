
import React from 'react';
import { formatDate } from '@/utils/formatters';

interface PatientInfoHeaderProps {
  patientName: string | null;
  patientId: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  gender?: string | null;
}

const PatientInfoHeader = ({ 
  patientName, 
  patientId, 
  dateOfBirth, 
  age, 
  gender 
}: PatientInfoHeaderProps) => {
  if (!patientName && !patientId) return null;
  
  // Format the patient demographic information
  const ageGenderText = [
    age !== undefined && age !== null ? `${age}y` : null,
    gender ? gender.charAt(0).toUpperCase() : null
  ].filter(Boolean).join('/');
  
  const demographicInfo = [
    dateOfBirth ? `DOB: ${formatDate(dateOfBirth)}` : null,
    ageGenderText || null
  ].filter(Boolean).join(' • ');
  
  return (
    <div className="space-y-1 mb-3">
      <h2 className="text-lg font-medium">
        Medical Report for {patientName || `Patient ID: ${patientId}`}
      </h2>
      {demographicInfo && (
        <p className="text-sm text-muted-foreground">
          {demographicInfo}
        </p>
      )}
    </div>
  );
};

export default PatientInfoHeader;
