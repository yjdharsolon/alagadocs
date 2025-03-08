
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { TextTemplate } from '../types';

interface EditButtonProps {
  onClick: () => void;
  templates?: TextTemplate[];
  onTemplateSelect?: (templateId: string) => void;
  showTemplateSelector?: boolean;
}

const EditButton = ({ 
  onClick, 
  templates = [], 
  onTemplateSelect,
  showTemplateSelector = false 
}: EditButtonProps) => {
  const navigate = useNavigate();
  
  if (!showTemplateSelector || templates.length === 0) {
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
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onClick}>
          Edit with default template
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/templates')}
          className="text-blue-600"
        >
          Manage templates
        </DropdownMenuItem>
        {templates.map(template => (
          <DropdownMenuItem 
            key={template.id}
            onClick={() => onTemplateSelect && onTemplateSelect(template.id)}
          >
            Edit with {template.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditButton;
