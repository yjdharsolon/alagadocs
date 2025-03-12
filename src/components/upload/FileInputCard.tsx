
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio } from 'lucide-react';
import { FileUploader } from './FileUploader';

interface FileInputCardProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export const FileInputCard: React.FC<FileInputCardProps> = ({ file, onFileSelect }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="h-5 w-5" />
          Audio File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploader 
          file={file} 
          onFileSelect={onFileSelect} 
        />
      </CardContent>
    </Card>
  );
};
