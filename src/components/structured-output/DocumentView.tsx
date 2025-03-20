
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
    
    // Check if all sections are empty
    const allEmpty = Object.values(structuredData).every(val => 
      !val || 
      (typeof val === 'string' && val.trim() === '') ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === 'object' && Object.keys(val).length === 0)
    );
    
    console.log('All sections empty:', allEmpty);
    
    // Debug medications specifically to check brand names
    if (structuredData.medications && Array.isArray(structuredData.medications)) {
      console.log('DocumentView medication data:', JSON.stringify(structuredData.medications, null, 2));
    }
  }, [structuredData]);
  
  // Use the centralized format detection logic
  const documentFormat = getDocumentFormat(structuredData);
  
  // Filter the data to only include format-specific fields
  const filteredData = filterStructuredDataByFormat(structuredData, documentFormat);
  
  // Get sections based on format
  const sections = getDocumentSections(documentFormat);
  
  // Check if all sections are empty
  const allEmpty = Object.values(filteredData).every(val => 
    !val || 
    (typeof val === 'string' && val.trim() === '') ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof val === 'object' && Object.keys(val).length === 0)
  );

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
      if (content.length === 0) {
        return '';
      }
      
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
            
            if (!genericName && !brandName) return '';
            
            medString += `${genericName}${brandName}`;
            if (item.strength) medString += ` ${item.strength}`;
            if (item.dosage) medString += `: ${item.dosage}`;
            if (item.frequency) medString += ` - ${item.frequency}`;
            if (item.dosageForm) medString += `\nForm: ${item.dosageForm}`;
            if (item.sigInstructions) medString += `\nInstructions: ${item.sigInstructions}`;
            if (item.quantity) medString += `\nQuantity: ${item.quantity}`;
            if (item.refills) medString += `\nRefills: ${item.refills}`;
            if (item.specialInstructions) medString += `\nSpecial Instructions: ${item.specialInstructions}`;
            
            return medString || '';
          }
          
          // Create a readable string representation of the object
          const formattedEntries = Object.entries(item)
            .filter(([_, value]) => value) // Only include properties with values
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
            
          return formattedEntries.length > 0 ? formattedEntries.join('\n') : '';
        }
        
        return String(item);
      }).filter(item => item).join('\n\n'); // Filter out empty items
    }
    
    // Handle patient information object for prescription format
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if ('name' in content || 'sex' in content || 'age' in content) {
        const formattedEntries = Object.entries(content)
          .filter(([_, value]) => value) // Only include properties with values
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              const subEntries = Object.entries(value)
                .filter(([_, subValue]) => subValue) // Only include properties with values
                .map(([subKey, subValue]) => `  ${subKey}: ${subValue}`);
                
              return subEntries.length > 0 ? 
                `${formattedKey}:\n${subEntries.join('\n')}` : '';
            }
            
            return `${formattedKey}: ${value}`;
          });
          
        return formattedEntries.length > 0 ? formattedEntries.join('\n') : '';
      }
    }
    
    // Handle prescriber information object for prescription format
    if (content && typeof content === 'object' && documentFormat === 'prescription') {
      if ('name' in content || 'licenseNumber' in content) {
        const formattedEntries = Object.entries(content)
          .filter(([_, value]) => value) // Only include properties with values
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            return `${formattedKey}: ${value}`;
          });
          
        return formattedEntries.length > 0 ? formattedEntries.join('\n') : '';
      }
    }
    
    // Default object handling for other sections
    if (content && typeof content === 'object') {
      const formattedEntries = Object.entries(content)
        .filter(([_, value]) => value) // Only include properties with values
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
          
          if (typeof value === 'object' && value !== null) {
            return `${formattedKey}: ${JSON.stringify(value, null, 2)}`;
          }
          
          return `${formattedKey}: ${value}`;
        });
        
      return formattedEntries.length > 0 ? formattedEntries.join('\n') : '';
    }
    
    // Fall back to JSON stringify for any other types
    return JSON.stringify(content, null, 2);
  };

  // Display a message when all sections are empty
  if (allEmpty) {
    return (
      <div className="document-view py-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="text-lg font-medium mb-2">No Content Generated</h3>
          <p>The system couldn't generate structured content from your input. Please provide more detailed medical information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-view space-y-4 py-2">
      {sections.map(section => {
        const content = filteredData[section.key as keyof MedicalSections];
        const formattedContent = formatSectionContent(content);
        
        // Only show sections that have content
        return content !== undefined && formattedContent.trim() !== '' && (
          <SectionView
            key={section.key}
            title={section.title}
            content={formattedContent}
          />
        );
      })}
      
      {/* If no sections have content but allEmpty check didn't catch it (edge case) */}
      {sections.length > 0 && sections.every(section => {
        const content = filteredData[section.key as keyof MedicalSections];
        const formattedContent = formatSectionContent(content);
        return !content || formattedContent.trim() === '';
      }) && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="text-lg font-medium mb-2">No Content Generated</h3>
          <p>The system couldn't generate structured content from your input. Please provide more detailed medical information.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentView;
