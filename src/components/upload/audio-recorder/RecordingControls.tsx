
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (isRecording) {
    return (
      <Button 
        variant="destructive" 
        size={isMobile ? "sm" : "lg"}
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
        className={`${isMobile ? 'h-16 w-16' : 'h-24 w-24'} rounded-full`}
        onClick={startRecording}
        disabled={isPlayingPreview}
      >
        <Mic className={`${isMobile ? 'h-6 w-6' : 'h-10 w-10'}`} />
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        Click to start recording
      </p>
      <p className="text-xs text-muted-foreground">
        Max 5 minutes
      </p>
    </div>
  );
};
