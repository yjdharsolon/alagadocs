
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface WorkflowHeaderProps {
  title: string;
  description: string;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">
        {description}
      </p>
      
      <Alert className="mb-6" variant="default">
        <Info className="h-4 w-4" />
        <AlertDescription>
          All steps of the transcription process are now combined on a single page for easier workflow.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default WorkflowHeader;
