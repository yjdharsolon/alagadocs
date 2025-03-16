
import React from 'react';
import { Button } from '@/components/ui/button';

interface PatientDetailsHeaderProps {
  onBack: () => void;
}

export const PatientDetailsHeader: React.FC<PatientDetailsHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="outline" onClick={onBack}>
        Back to Patient Search
      </Button>
      <h1 className="text-2xl font-bold">Patient Details</h1>
      <div className="w-[100px]"></div>
    </div>
  );
};
