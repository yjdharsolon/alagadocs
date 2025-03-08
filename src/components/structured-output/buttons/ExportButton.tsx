
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { MedicalSections } from '../types';
import { exportAsPDF } from '../utils/exportUtils';

export interface ExportButtonProps {
  sections?: MedicalSections;
}

const ExportButton = ({ sections }: ExportButtonProps) => {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = () => {
    if (!sections) return;
    
    setExporting(true);
    try {
      exportAsPDF(sections);
    } finally {
      // Set exporting back to false after a delay to account for async operations
      setTimeout(() => setExporting(false), 1000);
    }
  };
  
  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={exporting || !sections}
      className="flex items-center gap-1"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Export as PDF
        </>
      )}
    </Button>
  );
};

export default ExportButton;
