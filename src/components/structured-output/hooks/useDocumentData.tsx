
import { useState, useEffect } from 'react';
import { MedicalSections } from '../types';
import { getDocumentFormat, filterStructuredDataByFormat } from '../tabs/TabUtils';

/**
 * Hook to manage document data and format
 */
export const useDocumentData = (structuredData: MedicalSections) => {
  // Store a local copy of the latest data to ensure UI consistency
  const [localData, setLocalData] = useState<MedicalSections>(structuredData);
  
  // Update local data when structuredData changes
  useEffect(() => {
    console.log('[useDocumentData] structuredData changed, updating local data');
    setLocalData(structuredData);
  }, [structuredData]);
  
  // Log medications whenever structuredData changes to track data flow
  useEffect(() => {
    if (structuredData && structuredData.medications) {
      console.log('[useDocumentData] Current medications in structuredData:', 
        Array.isArray(structuredData.medications) 
          ? JSON.stringify(structuredData.medications, null, 2) 
          : structuredData.medications
      );
    }
  }, [structuredData]);
  
  // Detect document format
  const documentFormat = getDocumentFormat(localData);
  
  // Filter data by format
  const filteredData = filterStructuredDataByFormat(localData, documentFormat);
  
  const getStructuredText = () => {
    return Object.entries(filteredData)
      .map(([key, value]) => {
        const title = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .toUpperCase();
        
        return `${title}:\n${value}\n`;
      })
      .join('\n');
  };

  return {
    localData,
    setLocalData,
    documentFormat,
    filteredData,
    getStructuredText
  };
};
