
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadPageHeaderProps {
  title: string;
  description?: string;
}

export const UploadPageHeader: React.FC<UploadPageHeaderProps> = ({ 
  title, 
  description 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-6 border-none shadow-none bg-transparent">
      <CardHeader className="text-center pb-2">
        <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{title}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent className="text-center pt-0">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
};
