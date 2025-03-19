
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

interface PatientInfoProps {
  patientInfo: {
    name: string;
    sex: string;
    age: string;
    date: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientInfoCard: React.FC<PatientInfoProps> = ({
  patientInfo,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCircle className="h-5 w-5 mr-2" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Patient Name</Label>
          <Input 
            id="patientName" 
            name="name" 
            value={patientInfo.name || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="patientSex">Sex/Gender</Label>
          <Input 
            id="patientSex" 
            name="sex" 
            value={patientInfo.sex || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="patientAge">Age</Label>
          <Input 
            id="patientAge" 
            name="age" 
            value={patientInfo.age || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="patientDate">Date</Label>
          <Input 
            id="patientDate" 
            name="date" 
            type="date" 
            value={patientInfo.date || ''} 
            onChange={onChange} 
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
