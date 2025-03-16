
import React from 'react';
import { UserRound } from 'lucide-react';
import { Patient } from '@/types/patient';

interface PersonalInformationSectionProps {
  patient: Patient;
}

export const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  patient
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium flex items-center">
        <UserRound className="h-5 w-5 mr-2 text-primary" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p>{patient.first_name} {patient.last_name}</p>
        </div>
        {patient.date_of_birth && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{new Date(patient.date_of_birth).toLocaleDateString()}</p>
          </div>
        )}
        {patient.age && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p>{patient.age}</p>
          </div>
        )}
        {patient.gender && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{patient.gender}</p>
          </div>
        )}
        {patient.civil_status && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Civil Status</p>
            <p>{patient.civil_status}</p>
          </div>
        )}
        {patient.nationality && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nationality</p>
            <p>{patient.nationality}</p>
          </div>
        )}
        {patient.blood_type && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
            <p>{patient.blood_type}</p>
          </div>
        )}
        {patient.patient_id && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
            <p>{patient.patient_id}</p>
          </div>
        )}
        {patient.email && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{patient.email}</p>
          </div>
        )}
        {patient.phone && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{patient.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};
