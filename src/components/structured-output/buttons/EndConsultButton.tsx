
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface EndConsultButtonProps {
  onEndConsult?: () => void;
  isVisible?: boolean;
}

const EndConsultButton: React.FC<EndConsultButtonProps> = ({ 
  onEndConsult,
  isVisible = true
}) => {
  if (!isVisible) return null;
  
  const handleClick = () => {
    console.log('End Consultation button clicked');
    if (onEndConsult) {
      onEndConsult();
    }
  };
  
  return (
    <Button 
      variant="secondary" 
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <CheckCircle2 className="h-4 w-4" />
      End Consultation
    </Button>
  );
};

export default EndConsultButton;
