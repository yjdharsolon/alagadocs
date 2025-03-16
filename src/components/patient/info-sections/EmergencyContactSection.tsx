
import React from 'react';
import { Patient } from '@/types/patient';

interface EmergencyContactSectionProps {
  patient: Patient;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  patient
}) => {
  // Only render if at least one emergency contact field exists
  if (!patient.emergency_contact_name && !patient.emergency_contact_phone) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {patient.emergency_contact_name && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{patient.emergency_contact_name}</p>
          </div>
        )}
        {patient.emergency_contact_relationship && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Relationship</p>
            <p>{patient.emergency_contact_relationship}</p>
          </div>
        )}
        {patient.emergency_contact_phone && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{patient.emergency_contact_phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};
