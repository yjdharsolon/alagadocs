
import React from 'react';
import { MedicalSections } from './types';
import SectionView from './sections/SectionView';

interface DocumentViewProps {
  structuredData: MedicalSections;
}

const DocumentView: React.FC<DocumentViewProps> = ({ structuredData }) => {
  // Determine document format based on available fields
  const getDocumentFormat = (): 'standard' | 'soap' | 'consultation' | 'prescription' => {
    if ('subjective' in structuredData && 'objective' in structuredData) {
      return 'soap';
    } else if ('reasonForConsultation' in structuredData && 'impression' in structuredData) {
      return 'consultation';
    } else if ('patientInformation' in structuredData && 'prescriberInformation' in structuredData) {
      return 'prescription';
    } else {
      return 'standard';
    }
  };
  
  const documentFormat = getDocumentFormat();
  
  // Define sections based on format
  let sections;
  
  switch (documentFormat) {
    case 'soap':
      sections = [
        { key: 'subjective', title: 'SUBJECTIVE' },
        { key: 'objective', title: 'OBJECTIVE' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
      break;
    case 'consultation':
      sections = [
        { key: 'reasonForConsultation', title: 'REASON FOR CONSULTATION' },
        { key: 'history', title: 'HISTORY' },
        { key: 'findings', title: 'FINDINGS' },
        { key: 'impression', title: 'IMPRESSION' },
        { key: 'recommendations', title: 'RECOMMENDATIONS' }
      ];
      break;
    case 'prescription':
      sections = [
        { key: 'patientInformation', title: 'PATIENT INFORMATION' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'prescriberInformation', title: 'PRESCRIBER INFORMATION' }
      ];
      break;
    default:
      // Standard format
      sections = [
        { key: 'chiefComplaint', title: 'CHIEF COMPLAINT' },
        { key: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS' },
        { key: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY' },
        { key: 'medications', title: 'MEDICATIONS' },
        { key: 'allergies', title: 'ALLERGIES' },
        { key: 'physicalExamination', title: 'PHYSICAL EXAMINATION' },
        { key: 'assessment', title: 'ASSESSMENT' },
        { key: 'plan', title: 'PLAN' }
      ];
  }

  // Helper function to convert complex objects to strings for display
  const formatSectionContent = (content: any): string => {
    if (content === undefined || content === null) {
      return '';
    }
    
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle arrays of objects (like medications)
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'string') {
          return item;
        }
        
        // Format medication objects
        if (item && typeof item === 'object') {
          if ('name' in item && 'dosage' in item) {
            return `${item.name}: ${item.dosage}${item.frequency ? ' - ' + item.frequency : ''}`;
          }
          
          if ('name' in item && 'strength' in item) {
            const parts = [];
            parts.push(`${item.name} ${item.strength || ''}`);
            if (item.dosageForm) parts.push(`Form: ${item.dosageForm}`);
            if (item.sigInstructions) parts.push(`Instructions: ${item.sigInstructions}`);
            if (item.quantity) parts.push(`Quantity: ${item.quantity}`);
            if (item.refills) parts.push(`Refills: ${item.refills}`);
            if (item.specialInstructions) parts.push(`Special Instructions: ${item.specialInstructions}`);
            return parts.join('\n');
          }
          
          // Create a readable string representation of the object
          return Object.entries(item)
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join('\n');
        }
        
        return String(item);
      }).join('\n\n');
    }
    
    // Handle patient information object
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if (sections[0].key === 'patientInformation') {
        return Object.entries(content)
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              return `${formattedKey}:\n${Object.entries(value)
                .map(([subKey, subValue]) => `  ${subKey}: ${subValue}`)
                .join('\n')}`;
            }
            
            return `${formattedKey}: ${value}`;
          })
          .join('\n');
      }
    }
    
    // Handle prescriber information object
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if (sections[2].key === 'prescriberInformation') {
        return Object.entries(content)
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            return `${formattedKey}: ${value}`;
          })
          .join('\n');
      }
    }
    
    // Default object handling for other sections
    if (content && typeof content === 'object') {
      return Object.entries(content)
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
          
          if (typeof value === 'object' && value !== null) {
            return `${formattedKey}: ${JSON.stringify(value, null, 2)}`;
          }
          
          return `${formattedKey}: ${value}`;
        })
        .join('\n');
    }
    
    // Fall back to JSON stringify for any other types
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
