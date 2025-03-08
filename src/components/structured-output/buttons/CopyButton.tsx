
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { MedicalSections } from '../types';
import { formatClipboardText } from '../utils/exportUtils';

export interface CopyButtonProps {
  sections?: MedicalSections;
}

const CopyButton = ({ sections }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    if (!sections) return;
    
    const formattedText = formatClipboardText(sections);
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard');
        // Reset copied state after a delay
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
  return (
    <Button
      onClick={handleCopy}
      className="flex items-center gap-1"
      disabled={!sections}
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
          Copy to EMR
        </>
      )}
    </Button>
  );
};

export default CopyButton;
