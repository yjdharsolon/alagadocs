
import { useState } from 'react';
import { toast } from 'sonner';

export const useFileHandling = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    // Allow null to clear the file
    if (selectedFile === null) {
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    toast.success('File selected successfully');
  };
  
  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setIsRecording(false);
    toast.success('Recording saved successfully');
  };

  return {
    file,
    isRecording,
    setIsRecording,
    handleFileSelect,
    handleRecordingComplete
  };
};
