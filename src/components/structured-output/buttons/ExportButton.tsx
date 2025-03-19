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
import { exportAsPDF, exportPrescriptionAsPDF, exportAsText } from '../utils/exportUtils';
import { toast } from 'sonner';

interface ExportButtonProps {
  sections: MedicalSections;
  patientName?: string | null;
  profileData?: any;
  isPrescription?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  sections, 
  patientName,
  profileData,
  isPrescription = false,
  variant = 'outline',
  size = 'default'
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'text') => {
    try {
      setIsExporting(true);
      
      if (format === 'pdf') {
        if (isPrescription) {
          exportPrescriptionAsPDF(sections, patientName, profileData);
          toast.success('Exported prescription as PDF');
        } else {
          exportAsPDF(sections, patientName);
          toast.success('Exported as PDF');
        }
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
          className="flex items-center gap-2 border-[#33C3F0] text-[#33C3F0] hover:bg-[#33C3F0]/10 transition-colors duration-200"
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border border-[#E0E0E0] shadow-md z-50 bg-white">
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer hover:bg-[#33C3F0]/10 hover:text-[#33C3F0] transition-colors duration-200">
          <FileType className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('text')} className="cursor-pointer hover:bg-[#33C3F0]/10 hover:text-[#33C3F0] transition-colors duration-200">
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
