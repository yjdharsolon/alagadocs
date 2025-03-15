
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EndConsultButtonProps {
  isVisible: boolean;
  onEndConsult?: () => void;
}

const EndConsultButton = ({ isVisible, onEndConsult }: EndConsultButtonProps) => {
  const navigate = useNavigate();
  
  if (!isVisible) return null;

  const handleClick = () => {
    if (onEndConsult) {
      onEndConsult();
    } else {
      // Default behavior if no callback provided
      navigate('/select-patient');
    }
  };

  return (
    <Button 
      variant="secondary"
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      End Consultation
    </Button>
  );
};

export default EndConsultButton;
