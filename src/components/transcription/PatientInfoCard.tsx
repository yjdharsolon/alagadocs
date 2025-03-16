
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserRound } from 'lucide-react';

interface PatientInfoCardProps {
  patientName: string | null;
  patientId?: string | null;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientName, patientId }) => {
  if (!patientName) return null;
  
  return (
    <Card className="mb-6 border-green-100 shadow-sm">
      <CardContent className="py-3 flex items-center">
        <UserRound className="h-5 w-5 mr-2 text-green-600" />
        <div>
          <p className="font-medium">Patient: {patientName}</p>
          {patientId && (
            <p className="text-xs text-muted-foreground">ID: {patientId}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
