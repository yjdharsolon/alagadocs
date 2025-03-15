
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Patient } from '@/types/patient';

interface PatientDisplayCardProps {
  patient: Patient;
  onChangePatient: () => void;
}

export const PatientDisplayCard: React.FC<PatientDisplayCardProps> = ({ 
  patient, 
  onChangePatient 
}) => {
  return (
    <Card className="mb-4 bg-muted/50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                Current Patient: {patient.first_name} {patient.last_name}
              </p>
              {patient.patient_id && (
                <p className="text-xs text-muted-foreground">ID: {patient.patient_id}</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onChangePatient}>
            Change Patient
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
