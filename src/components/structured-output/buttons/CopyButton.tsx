
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { MedicalSections } from '../types';
import { formatClipboardText } from '../utils/clipboardUtils';
import { toast } from 'sonner';

interface CopyButtonProps {
  sections: MedicalSections;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  sections, 
  variant = 'outline',
  size = 'default'
}) => {
  const handleCopy = () => {
    const formattedText = formatClipboardText(sections);
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      <Copy className="h-4 w-4" />
      Copy
    </Button>
  );
};

export default CopyButton;
