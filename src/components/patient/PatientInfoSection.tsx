
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, UserRound } from 'lucide-react';
import { Patient } from '@/types/patient';

interface PatientInfoSectionProps {
  patient: Patient;
  onEditPatient: () => void;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  patient,
  onEditPatient
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Patient Information</CardTitle>
        <Button 
          variant="outline" 
          onClick={onEditPatient}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Patient
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
          
          {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
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
          )}
          
          {(patient.allergies || patient.medical_conditions) && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
