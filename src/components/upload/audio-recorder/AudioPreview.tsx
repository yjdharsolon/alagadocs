
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioPreviewProps {
  audioPreviewRef: React.RefObject<HTMLAudioElement>;
  audioPreview: string;
  isPlayingPreview: boolean;
  togglePlayPreview: () => void;
  resetRecording: () => void;
  recordingTime: number;
  formatTime: (seconds: number) => string;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioPreviewRef,
  audioPreview,
  isPlayingPreview,
  togglePlayPreview,
  resetRecording,
  recordingTime,
  formatTime
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center p-2 rounded-md bg-muted/50">
      <audio ref={audioPreviewRef} src={audioPreview} className="hidden"></audio>
      <div className="flex gap-1 w-full mb-1">
        <Button 
          type="button"
          variant="secondary" 
          size={isMobile ? "xs" : "sm"}
          onClick={togglePlayPreview}
          className="flex-1 gap-1"
        >
          {isPlayingPreview ? (
            <><Pause className="h-3 w-3" /> Pause</>
          ) : (
            <><Play className="h-3 w-3" /> Play</>
          )}
        </Button>
        <Button 
          type="button"
          variant="destructive" 
          size={isMobile ? "xs" : "sm"}
          onClick={resetRecording}
          className="flex-shrink-0 gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Length: {formatTime(recordingTime)}
      </p>
    </div>
  );
};
