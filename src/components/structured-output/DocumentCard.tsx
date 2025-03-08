
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
}

const DocumentCard = ({ user, sections, structuredText, handleEdit }: DocumentCardProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto mb-6 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary">Formatted Medical Documentation</CardTitle>
        <CardDescription>
          Structured notes based on medical transcription
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
