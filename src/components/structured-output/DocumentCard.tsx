import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DocumentTabs from './DocumentTabs';
import ActionButtons from './ActionButtons';
import { MedicalSections } from './types';
import toast from 'react-hot-toast';

interface DocumentCardProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  handleEdit: () => void;
  timestamp?: string;
}

const DocumentCard = ({ 
  user, 
  sections, 
  structuredText, 
  handleEdit, 
  timestamp 
}: DocumentCardProps) => {
  // Format date if timestamp is provided
  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  const handleCopy = () => {
    // Format the structured data for clipboard
    let formattedText = '';
    Object.entries(sections).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        const sectionTitle = key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        formattedText += `${sectionTitle}:\n${value}\n\n`;
      }
    });
    
    navigator.clipboard.writeText(formattedText.trim())
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-6 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary">Formatted Medical Documentation</CardTitle>
        <CardDescription>
          Structured notes based on medical transcription
          {timestamp && (
            <p className="text-xs text-muted-foreground mt-1">
              Created: {formattedDate}
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <DocumentTabs structuredData={sections} />
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <ActionButtons 
          user={user}
          sections={sections}
          structuredText={structuredText}
          onEdit={handleEdit}
          onCopy={handleCopy}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
