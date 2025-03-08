
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface StructuredOutputHeaderProps {
  onBack: () => void;
}

const StructuredOutputHeader = ({ onBack }: StructuredOutputHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Transcription
      </Button>
      
      <h1 className="text-2xl font-bold">Structured Medical Notes</h1>
      
      <div className="w-[100px]"></div>
    </div>
  );
};

export default StructuredOutputHeader;
