
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <Pencil className="h-4 w-4" />
      Edit
    </Button>
  );
};

export default EditButton;
