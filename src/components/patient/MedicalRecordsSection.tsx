
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Stethoscope, Loader2 } from 'lucide-react';
import { PatientRecordsTable } from './records/PatientRecordsTable';
import { EmptyRecordsState } from './records/EmptyRecordsState';

interface MedicalRecordsSectionProps {
  loading: boolean;
  patientNotes: any[];
  onStartConsultation: () => void;
}

export const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  loading,
  patientNotes,
  onStartConsultation
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Records</CardTitle>
        <Button onClick={onStartConsultation}>
          <Stethoscope className="mr-2 h-4 w-4" />
          Start New Consultation
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : patientNotes.length > 0 ? (
          <PatientRecordsTable patientNotes={patientNotes} />
        ) : (
          <EmptyRecordsState onStartConsultation={onStartConsultation} />
        )}
      </CardContent>
    </Card>
  );
};
