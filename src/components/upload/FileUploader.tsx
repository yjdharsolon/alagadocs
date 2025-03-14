
import React, { useRef, useState } from 'react';
import { Upload, FileAudio } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ file, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };
  
  const validateAndProcessFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.includes('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }
    
    // Check file size (limit to 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File size should be less than 50MB');
      return;
    }
    
    onFileSelect(selectedFile);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div 
        className={`border-2 border-dashed rounded-lg ${isMobile ? 'p-4' : 'p-8'} text-center cursor-pointer transition-colors
          ${isDragging ? 'bg-accent/50 border-primary' : 'hover:bg-accent/50'}`}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="audio/*" 
          onChange={handleFileChange}
        />
        <Upload className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} mx-auto mb-2 text-muted-foreground`} />
        <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium`}>
          {isMobile ? "Tap to upload audio" : "Drag and drop or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          MP3, WAV, M4A (max 50MB)
        </p>
      </div>
      
      {file && (
        <div className="bg-accent/30 p-2 rounded-lg flex items-center">
          <FileAudio className="h-6 w-6 mr-2" />
          <div className="flex-1 truncate">
            <p className="font-medium truncate text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
