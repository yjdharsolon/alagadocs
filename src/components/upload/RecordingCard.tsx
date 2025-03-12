
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recording
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AudioRecorder 
          onRecordingComplete={onRecordingComplete} 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </CardContent>
    </Card>
  );
};
