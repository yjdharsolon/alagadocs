
import React from 'react';
import SectionContent from '../../SectionContent';
import { formatPrescriberInfo } from './formatUtils';

interface PrescriberTabProps {
  prescriberInfo: any;
  structuredPrescriberInfo: any;
}

const PrescriberTab: React.FC<PrescriberTabProps> = ({ 
  prescriberInfo, 
  structuredPrescriberInfo 
}) => {
  return (
    <SectionContent 
      title="PRESCRIBER INFORMATION" 
      content={formatPrescriberInfo(prescriberInfo, structuredPrescriberInfo)}
    />
  );
};

export default PrescriberTab;
