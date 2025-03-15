
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface NewPatientCardProps {
  onCreatePatient: () => void;
}

export const NewPatientCard: React.FC<NewPatientCardProps> = ({ onCreatePatient }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Patient Found?</CardTitle>
        <CardDescription>
          Register a new patient to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onCreatePatient} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
      </CardContent>
    </Card>
  );
};
