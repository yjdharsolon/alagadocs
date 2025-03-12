
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { AudioRecorder } from './audio-recorder';

interface RecordingCardProps {
  onRecordingComplete: (file: File) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  isUploading: boolean;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({ 
  onRecordingComplete, 
  isRecording, 
  setIsRecording,
  isUploading
}) => {
  return (
    <Card className="mb-6 border-[#33C3F0]/10 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-[#F6F6F7] to-[#F1F1F1] rounded-t-md">
        <CardTitle className="flex items-center gap-2 text-[#403E43]">
          <Mic className="h-5 w-5 text-[#1EAEDB]" />
          Voice Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <AudioRecorder 
          onRecordingComplete={onRecordingComplete} 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </CardContent>
    </Card>
  );
};
