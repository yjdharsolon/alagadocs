
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Patient } from '@/types/patient';
import { PersonalInformationSection } from './info-sections/PersonalInformationSection';
import { EmergencyContactSection } from './info-sections/EmergencyContactSection';
import { MedicalInformationSection } from './info-sections/MedicalInformationSection';

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
          <PersonalInformationSection patient={patient} />
          <EmergencyContactSection patient={patient} />
          <MedicalInformationSection patient={patient} />
        </div>
      </CardContent>
    </Card>
  );
};
