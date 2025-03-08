
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DocumentTabs from './DocumentTabs';
import ActionButtons from './ActionButtons';
import { MedicalSections } from './types';

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
        <DocumentTabs sections={sections} />
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <ActionButtons 
          user={user}
          sections={sections}
          structuredText={structuredText}
          handleEdit={handleEdit}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
