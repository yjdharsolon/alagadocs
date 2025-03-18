
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyTemplateStateProps {
  onCreateTemplate: () => void;
}

const EmptyTemplateState: React.FC<EmptyTemplateStateProps> = ({ onCreateTemplate }) => {
  return (
    <div className="text-center p-8 border rounded-lg bg-background">
      <h3 className="text-lg font-medium mb-2">No templates yet</h3>
      <p className="text-muted-foreground mb-4">
        Create custom templates to structure your medical notes exactly how you prefer.
      </p>
      <Button onClick={onCreateTemplate}>
        Create Your First Template
      </Button>
    </div>
  );
};

export default EmptyTemplateState;
