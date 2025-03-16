
import React from 'react';
import { MedicalSections } from './types';
import SectionView from './sections/SectionView';

interface DocumentViewProps {
  structuredData: MedicalSections;
}

const DocumentView: React.FC<DocumentViewProps> = ({ structuredData }) => {
  // Map the sections to their display titles
  const sections = [
    { key: 'chiefComplaint', title: 'CHIEF COMPLAINT' },
    { key: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS' },
    { key: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY' },
    { key: 'medications', title: 'MEDICATIONS' },
    { key: 'allergies', title: 'ALLERGIES' },
    { key: 'physicalExamination', title: 'PHYSICAL EXAMINATION' },
    { key: 'assessment', title: 'ASSESSMENT' },
    { key: 'plan', title: 'PLAN' }
  ];

  return (
    <div className="document-view space-y-4 py-2">
      {sections.map(section => (
        <SectionView
          key={section.key}
          title={section.title}
          content={structuredData[section.key as keyof MedicalSections] || ''}
        />
      ))}
    </div>
  );
};

export default DocumentView;
