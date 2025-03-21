
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
import { exportAsText } from '../utils/exportUtils';
import { exportAsPDF, exportPrescriptionAsPDF } from '../utils/pdf/index';
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
      
      // Add debugging information
      console.log('Export request:', {
        format,
        isPrescription,
        sections: JSON.stringify(sections, null, 2),
        patientName,
        hasProfileData: !!profileData,
        profileDataSummary: profileData ? {
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`,
          clinic: profileData.clinic_name,
          hasPRC: !!profileData.prc_license
        } : 'No profile data'
      });
      
      if (format === 'pdf') {
        if (isPrescription) {
          console.log('DEBUG: Calling exportPrescriptionAsPDF with:', {
            sectionsKeys: Object.keys(sections),
            patientInfo: sections.patientInformation,
            medications: Array.isArray(sections.medications) ? 
              `Array with ${sections.medications.length} items` : 
              typeof sections.medications,
            prescriberInfo: sections.prescriberInformation,
          });
          
          // Directly use the function from pdf/index.ts to avoid circular imports
          exportPrescriptionAsPDF(sections, patientName, profileData);
          toast.success('Exported prescription as PDF');
        } else {
          console.log('DEBUG: Calling exportAsPDF for non-prescription');
          exportAsPDF(sections, patientName);
          toast.success('Exported as PDF');
        }
      } else {
        console.log('DEBUG: Calling exportAsText');
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
