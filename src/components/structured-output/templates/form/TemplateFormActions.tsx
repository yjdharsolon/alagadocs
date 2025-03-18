
import React from 'react';
import { Button } from '@/components/ui/button';

interface TemplateFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const TemplateFormActions = ({ onCancel, isEditing }: TemplateFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? 'Update Template' : 'Create Template'}
      </Button>
    </div>
  );
};

export default TemplateFormActions;
