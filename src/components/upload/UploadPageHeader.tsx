
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="mb-4">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
};
