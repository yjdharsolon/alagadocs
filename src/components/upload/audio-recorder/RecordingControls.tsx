
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPlayingPreview: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPlayingPreview,
  startRecording,
  stopRecording
}) => {
  if (isRecording) {
    return (
      <Button 
        variant="destructive" 
        size="lg" 
        onClick={stopRecording}
        className="w-full gap-2"
      >
        <StopCircle className="h-4 w-4" />
        Stop Recording
      </Button>
    );
  }
  
  return (
    <div className="text-center">
      <Button 
        variant="outline" 
        size="lg" 
        className="h-24 w-24 rounded-full"
        onClick={startRecording}
        disabled={isPlayingPreview}
      >
        <Mic className="h-10 w-10" />
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        Click to start recording your voice
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Maximum recording time is 5 minutes
      </p>
    </div>
  );
};
