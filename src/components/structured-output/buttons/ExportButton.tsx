
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileType } from 'lucide-react';
import { MedicalSections } from '../types';
import { exportAsPDF } from '../utils/pdfExport';
import { exportAsText } from '../utils/textExport';
import { toast } from 'sonner';

interface ExportButtonProps {
  sections: MedicalSections;
  patientName?: string | null;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  sections, 
  patientName,
  variant = 'outline',
  size = 'default'
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'text') => {
    try {
      setIsExporting(true);
      
      if (format === 'pdf') {
        exportAsPDF(sections, patientName);
        toast.success('Exported as PDF');
      } else {
        exportAsText(sections, patientName);
        toast.success('Exported as text file');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export document');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileType className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('text')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
