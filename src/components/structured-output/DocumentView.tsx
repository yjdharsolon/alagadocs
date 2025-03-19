
import React, { useEffect } from 'react';
import { MedicalSections } from './types';
import SectionView from './sections/SectionView';
import { getDocumentFormat, getDocumentSections, filterStructuredDataByFormat } from './tabs/TabUtils';

interface DocumentViewProps {
  structuredData: MedicalSections;
}

const DocumentView: React.FC<DocumentViewProps> = ({ structuredData }) => {
  // Add debugging to see what format is detected and what data is available
  useEffect(() => {
    console.log('DocumentView received structuredData:', structuredData);
    const format = getDocumentFormat(structuredData);
    console.log('Detected document format:', format);
    console.log('Filtered data:', filterStructuredDataByFormat(structuredData, format));
  }, [structuredData]);
  
  // Use the centralized format detection logic
  const documentFormat = getDocumentFormat(structuredData);
  
  // Filter the data to only include format-specific fields
  const filteredData = filterStructuredDataByFormat(structuredData, documentFormat);
  
  // Get sections based on format
  const sections = getDocumentSections(documentFormat);

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
          if (('genericName' in item || 'name' in item) && ('dosageForm' in item || 'strength' in item)) {
            let medString = '';
            
            // Handle both new format (genericName + brandName) and old format (name)
            const genericName = item.genericName || item.name || '';
            const brandName = item.brandName ? ` (${item.brandName})` : '';
            
            medString += `${genericName}${brandName}`;
            if (item.strength) medString += ` ${item.strength}`;
            if (item.dosage) medString += `: ${item.dosage}`;
            if (item.frequency) medString += ` - ${item.frequency}`;
            if (item.dosageForm) medString += `\nForm: ${item.dosageForm}`;
            if (item.sigInstructions) medString += `\nInstructions: ${item.sigInstructions}`;
            if (item.quantity) medString += `\nQuantity: ${item.quantity}`;
            if (item.refills) medString += `\nRefills: ${item.refills}`;
            if (item.specialInstructions) medString += `\nSpecial Instructions: ${item.specialInstructions}`;
            
            return medString || JSON.stringify(item);
          }
          
          // Create a readable string representation of the object
          return Object.entries(item)
            .filter(([_, value]) => value) // Only include properties with values
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join('\n');
        }
        
        return String(item);
      }).join('\n\n');
    }
    
    // Handle patient information object for prescription format
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if ('name' in content || 'sex' in content || 'age' in content) {
        return Object.entries(content)
          .filter(([_, value]) => value) // Only include properties with values
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              return `${formattedKey}:\n${Object.entries(value)
                .filter(([_, subValue]) => subValue) // Only include properties with values
                .map(([subKey, subValue]) => `  ${subKey}: ${subValue}`)
                .join('\n')}`;
            }
            
            return `${formattedKey}: ${value}`;
          })
          .join('\n');
      }
    }
    
    // Handle prescriber information object for prescription format
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if ('name' in content || 'licenseNumber' in content) {
        return Object.entries(content)
          .filter(([_, value]) => value) // Only include properties with values
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
        .filter(([_, value]) => value) // Only include properties with values
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

  // Add debugging for empty sections
  if (sections.length === 0 || Object.keys(filteredData).length === 0) {
    console.error('No sections or filtered data available for format:', documentFormat);
    console.log('Available sections:', sections);
    console.log('Filtered data keys:', Object.keys(filteredData));
  }

  return (
    <div className="document-view space-y-4 py-2">
      {sections.map(section => {
        const content = filteredData[section.key as keyof MedicalSections];
        
        // Debug any missing content
        if (content === undefined) {
          console.log(`Missing content for section ${section.key} in format ${documentFormat}`);
        }
        
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
