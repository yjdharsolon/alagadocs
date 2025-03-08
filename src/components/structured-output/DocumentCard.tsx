
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentTabs from './DocumentTabs';
import ActionButtons from './ActionButtons';

interface DocumentCardProps {
  user: any;
  sections: {[key: string]: string};
  structuredText: string;
  handleEdit: () => void;
}

const DocumentCard = ({ user, sections, structuredText, handleEdit }: DocumentCardProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto mb-6">
      <CardHeader>
        <CardTitle>Formatted Medical Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentTabs sections={sections} />
      </CardContent>
      <CardFooter>
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
