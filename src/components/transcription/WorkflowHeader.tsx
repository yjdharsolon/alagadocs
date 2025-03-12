
import React, { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowHeaderProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  alertContent?: ReactNode;
  alertVariant?: 'default' | 'destructive';
  alertIcon?: ReactNode;
  showAlert?: boolean;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  alertContent,
  alertVariant = 'default',
  alertIcon = <Info className="h-4 w-4" />,
  showAlert = false,
}) => {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className={cn("text-3xl font-bold mb-2", titleClassName)}>{title}</h1>
      
      {description && (
        <p className={cn("text-muted-foreground mb-6", descriptionClassName)}>
          {description}
        </p>
      )}
      
      {(showAlert || alertContent) && (
        <Alert className="mb-6" variant={alertVariant}>
          {alertIcon}
          <AlertDescription>
            {alertContent || "All steps of the transcription process are now combined on a single page for easier workflow."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WorkflowHeader;
