
import React from 'react';
import { Patient } from '@/types/patient';

interface MedicalInformationSectionProps {
  patient: Patient;
}

export const MedicalInformationSection: React.FC<MedicalInformationSectionProps> = ({
  patient
}) => {
  // Only render if at least one medical information field exists
  if (!patient.allergies && !patient.medical_conditions) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium">Medical Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {patient.allergies && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Allergies</p>
            <p className="whitespace-pre-line">{patient.allergies}</p>
          </div>
        )}
        {patient.medical_conditions && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
            <p className="whitespace-pre-line">{patient.medical_conditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};
