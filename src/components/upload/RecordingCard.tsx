
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { AudioRecorder } from './audio-recorder';
import { SimulationButton } from './SimulationButton';

interface RecordingCardProps {
  onRecordingComplete: (file: File) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onSimulate: () => void;
  isUploading: boolean;
  isSimulating: boolean;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({ 
  onRecordingComplete, 
  isRecording, 
  setIsRecording,
  onSimulate,
  isUploading,
  isSimulating
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
        
        <SimulationButton 
          onSimulate={onSimulate} 
          disabled={isUploading || isRecording} 
          isSimulating={isSimulating}
        />
      </CardContent>
    </Card>
  );
};
