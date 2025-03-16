
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserRound } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface CompactPatientHeaderProps {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  patientId?: string | null;
}

export const CompactPatientHeader: React.FC<CompactPatientHeaderProps> = ({ 
  firstName, 
  lastName, 
  dateOfBirth, 
  age, 
  gender,
  patientId 
}) => {
  if (!firstName && !lastName) return null;
  
  return (
    <Card className="mb-3 border-green-100 shadow-sm">
      <CardContent className="p-2 flex items-center justify-between">
        <div className="flex items-center">
          <UserRound className="h-4 w-4 mr-2 text-green-600" />
          <div>
            <span className="font-medium">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {dateOfBirth ? `${formatDate(dateOfBirth)}` : ''}
              {age ? ` · ${age}y` : ''}
              {gender ? ` · ${gender}` : ''}
            </span>
          </div>
        </div>
        {patientId && (
          <span className="text-xs text-muted-foreground">ID: {patientId}</span>
        )}
      </CardContent>
    </Card>
  );
};
