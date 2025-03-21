
import { useState } from 'react';
import { MedicalSections } from '@/components/structured-output/types';
import { structureText } from '@/services/structure/structureService';
import { toast } from 'sonner';
import { detectFormat } from '@/services/structure/normalizers/formatDetector';

export const useFormatGeneration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formattedVersions, setFormattedVersions] = useState<Array<{
    formatType: string;
    formattedText: string;
    structuredData: MedicalSections;
    selected: boolean;
  }>>([]);

  const generateFormattedVersions = async (transcriptionText: string) => {
    if (!transcriptionText) {
      toast.error('No transcription text provided');
      return null;
    }

    setIsProcessing(true);
    
    try {
      const formatTypes = [
        { id: 'history', name: 'History & Physical' },
        { id: 'consultation', name: 'Consultation' },
        { id: 'prescription', name: 'Prescription' },
        { id: 'soap', name: 'SOAP Note' }
      ];
      
      const formattedResults = [];
      
      for (const formatType of formatTypes) {
        try {
          console.log(`Generating ${formatType.name} format...`);
          
          // Pass format type as role parameter
          const structuredResult = await structureText(
            transcriptionText, 
            formatType.id
          );
          
          if (structuredResult) {
            // Ensure the format type is correctly set
            const detectedFormat = detectFormat(structuredResult, formatType.id);
            console.log(`Generated ${formatType.name} format, detected as: ${detectedFormat}`);
            
            // Format the text representation
            const formattedText = Object.entries(structuredResult)
              .map(([key, value]) => {
                const title = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return `# ${title}\n${value}`;
              })
              .join('\n\n');
              
            formattedResults.push({
              formatType: formatType.id,
              formattedText,
              structuredData: structuredResult,
              selected: formatType.id === 'history'  // Select history by default
            });
          }
        } catch (err) {
          console.error(`Error generating ${formatType.name} format:`, err);
        }
      }
      
      if (formattedResults.length > 0) {
        setFormattedVersions(formattedResults);
        
        // Return the default format (History & Physical)
        const defaultFormat = formattedResults.find(f => f.formatType === 'history') || formattedResults[0];
        toast.success('Multiple format types generated successfully');
        return defaultFormat.structuredData;
      }
      
      throw new Error('Failed to generate any formatted versions');
    } catch (error) {
      console.error('Error generating formatted versions:', error);
      toast.error('Failed to generate formatted versions');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    formattedVersions,
    setFormattedVersions,
    generateFormattedVersions
  };
};
