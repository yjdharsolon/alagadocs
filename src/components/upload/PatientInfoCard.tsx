
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';

interface PatientInfoCardProps {
  patientName?: string;
  patientId?: string | null;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientName, patientId }) => {
  if (!patientName && !patientId) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-green-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <UserRound className="h-5 w-5 mr-2 text-green-600" />
          Current Patient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm flex flex-col">
          <p className="font-medium text-gray-900">{patientName || 'Unknown Patient'}</p>
          {patientId && (
            <p className="text-gray-500 text-xs mt-1">ID: {patientId}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
