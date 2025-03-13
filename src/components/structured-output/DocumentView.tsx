
import React, { useState } from 'react';
import { MedicalSections } from './types';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { List, AlignLeft } from 'lucide-react';

interface DocumentViewProps {
  structuredData: MedicalSections;
}

const DocumentView = ({ structuredData }: DocumentViewProps) => {
  const [viewFormat, setViewFormat] = useState<'paragraph' | 'bullets'>('paragraph');
  
  // Function to render content based on the selected format
  const renderContent = (content: string) => {
    if (!content || content.trim() === '') return null;
    
    if (viewFormat === 'bullets') {
      // Split by new lines and create bullet points
      return (
        <ul className="list-disc pl-5 space-y-1">
          {content.split('\n').filter(line => line.trim() !== '').map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      );
    }
    
    // Paragraph view - preserve line breaks
    return (
      <p className="whitespace-pre-wrap">
        {content}
      </p>
    );
  };

  // All sections to display in order
  const sections = [
    { id: 'chiefComplaint', title: 'CHIEF COMPLAINT', content: structuredData.chiefComplaint },
    { id: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS', content: structuredData.historyOfPresentIllness },
    { id: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY', content: structuredData.pastMedicalHistory },
    { id: 'medications', title: 'MEDICATIONS', content: structuredData.medications },
    { id: 'allergies', title: 'ALLERGIES', content: structuredData.allergies },
    { id: 'physicalExamination', title: 'PHYSICAL EXAMINATION', content: structuredData.physicalExamination },
    { id: 'assessment', title: 'ASSESSMENT', content: structuredData.assessment },
    { id: 'plan', title: 'PLAN', content: structuredData.plan }
  ];

  return (
    <div className="document-view">
      <div className="flex justify-end mb-4">
        <div className="space-y-1">
          <div className="text-sm font-medium">View Format</div>
          <ToggleGroup 
            type="single" 
            value={viewFormat}
            onValueChange={(value) => value && setViewFormat(value as 'paragraph' | 'bullets')}
          >
            <ToggleGroupItem value="paragraph" aria-label="Paragraph view">
              <AlignLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Paragraph</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="bullets" aria-label="Bullet points view">
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Bullets</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="document-content p-6 bg-white border rounded-md shadow-sm">
        {sections.map((section) => (
          section.content ? (
            <div key={section.id} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{section.title}:</h3>
              <div className="pl-1">
                {renderContent(section.content)}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default DocumentView;
