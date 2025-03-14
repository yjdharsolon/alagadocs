
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { AudioRecorder } from './audio-recorder';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-4 border-[#33C3F0]/10 shadow-sm">
      <CardHeader className={`bg-gradient-to-r from-[#F6F6F7] to-[#F1F1F1] rounded-t-md ${isMobile ? "px-3 py-2" : "py-4"}`}>
        <CardTitle className="flex items-center gap-2 text-[#403E43] text-base">
          <Mic className="h-4 w-4 text-[#1EAEDB]" />
          Voice Recording
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-2" : "pt-4"}>
        <AudioRecorder 
          onRecordingComplete={onRecordingComplete} 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </CardContent>
    </Card>
  );
};
