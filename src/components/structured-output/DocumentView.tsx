
import React from 'react';
import { MedicalSections } from './types';
import SectionView from './sections/SectionView';

interface DocumentViewProps {
  structuredData: MedicalSections;
}

const DocumentView: React.FC<DocumentViewProps> = ({ structuredData }) => {
  // Check if this is a SOAP format note
  const isSoapFormat = 'subjective' in structuredData && 'objective' in structuredData &&
                     !('chiefComplaint' in structuredData) && !('historyOfPresentIllness' in structuredData);
  
  // Define sections based on format
  const sections = isSoapFormat ? [
    { key: 'subjective', title: 'SUBJECTIVE' },
    { key: 'objective', title: 'OBJECTIVE' },
    { key: 'assessment', title: 'ASSESSMENT' },
    { key: 'plan', title: 'PLAN' }
  ] : [
    { key: 'chiefComplaint', title: 'CHIEF COMPLAINT' },
    { key: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS' },
    { key: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY' },
    { key: 'medications', title: 'MEDICATIONS' },
    { key: 'allergies', title: 'ALLERGIES' },
    { key: 'physicalExamination', title: 'PHYSICAL EXAMINATION' },
    { key: 'assessment', title: 'ASSESSMENT' },
    { key: 'plan', title: 'PLAN' }
  ];

  // Helper function to convert complex objects to strings for display
  const formatSectionContent = (content: any): string => {
    if (content === undefined || content === null) {
      return '';
    }
    
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle arrays
    if (Array.isArray(content)) {
      return content.map(item => 
        typeof item === 'string' ? item : JSON.stringify(item, null, 2)
      ).join('\n');
    }
    
    // Handle objects
    return JSON.stringify(content, null, 2);
  };

  return (
    <div className="document-view space-y-4 py-2">
      {sections.map(section => {
        const content = structuredData[section.key as keyof MedicalSections];
        return content !== undefined && (
          <SectionView
            key={section.key}
            title={section.title}
            content={formatSectionContent(content)}
          />
        );
      })}
    </div>
  );
};

export default DocumentView;
