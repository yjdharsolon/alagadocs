
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { TextTemplate } from '../types';

interface EditButtonProps {
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  templates?: TextTemplate[];
  onTemplateSelect?: (templateId: string) => void;
  showTemplateSelector?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ 
  onClick, 
  variant = 'outline',
  size = 'default',
  templates,
  onTemplateSelect,
  showTemplateSelector = false
}) => {
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={onClick}
      className="flex items-center gap-2 border-[#33C3F0] text-[#33C3F0] hover:bg-[#33C3F0]/10 transition-colors duration-200"
    >
      <Edit className="h-4 w-4" />
      Edit
    </Button>
  );
};

export default EditButton;
