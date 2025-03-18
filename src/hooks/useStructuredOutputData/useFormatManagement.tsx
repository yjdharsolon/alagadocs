
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';

interface UseFormatManagementProps {
  formattedVersions: Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>;
  setFormattedVersions: React.Dispatch<React.SetStateAction<Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>>>;
  setStructuredData: (data: MedicalSections) => void;
}

export const useFormatManagement = ({
  formattedVersions,
  setFormattedVersions,
  setStructuredData
}: UseFormatManagementProps) => {
  const [activeFormatType, setActiveFormatType] = useState<string>('history');

  // Handle format type change
  const handleFormatTypeChange = (formatType: string) => {
    setActiveFormatType(formatType);
    const selectedFormat = formattedVersions.find(f => f.formatType === formatType);
    if (selectedFormat) {
      setStructuredData(selectedFormat.structuredData);
    }
  };

  // Toggle selection of a format
  const toggleFormatSelection = (formatType: string) => {
    setFormattedVersions(prev => 
      prev.map(format => 
        format.formatType === formatType 
          ? { ...format, selected: !format.selected } 
          : format
      )
    );
  };

  // Get only the selected formats
  const getSelectedFormats = () => {
    return formattedVersions.filter(format => format.selected);
  };

  return {
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats
  };
};
