
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileInputCardProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export const FileInputCard: React.FC<FileInputCardProps> = ({ file, onFileSelect }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-4 border-[#33C3F0]/10 shadow-sm">
      <CardHeader className={`bg-gradient-to-r from-[#F6F6F7] to-[#F1F1F1] rounded-t-md ${isMobile ? "px-3 py-2" : "py-4"}`}>
        <CardTitle className="flex items-center gap-2 text-[#403E43] text-base">
          <FileAudio className="h-4 w-4 text-[#1EAEDB]" />
          Audio File
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-2 ${isMobile ? "px-3 py-2" : ""}`}>
        <FileUploader 
          file={file} 
          onFileSelect={onFileSelect} 
        />
      </CardContent>
    </Card>
  );
};
