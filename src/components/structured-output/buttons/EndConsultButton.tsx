
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface EndConsultButtonProps {
  isVisible: boolean;
  onEndConsult: () => void;
}

const EndConsultButton = ({ isVisible, onEndConsult }: EndConsultButtonProps) => {
  if (!isVisible) return null;

  return (
    <Button 
      variant="secondary"
      onClick={onEndConsult}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      End Consultation
    </Button>
  );
};

export default EndConsultButton;
