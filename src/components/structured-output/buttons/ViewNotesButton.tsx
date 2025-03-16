
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewNotesButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ViewNotesButton: React.FC<ViewNotesButtonProps> = ({ 
  variant = 'outline',
  size = 'default'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/notes');
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      View Notes
    </Button>
  );
};

export default ViewNotesButton;
