
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyRecordsStateProps {
  onStartConsultation: () => void;
}

export const EmptyRecordsState: React.FC<EmptyRecordsStateProps> = ({
  onStartConsultation
}) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>No medical records available for this patient.</p>
      <Button 
        onClick={onStartConsultation} 
        variant="outline" 
        className="mt-2"
      >
        Create First Record
      </Button>
    </div>
  );
};
