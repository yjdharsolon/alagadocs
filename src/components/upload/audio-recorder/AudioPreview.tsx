
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

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
  return (
    <div className="flex flex-col items-center p-4 rounded-md bg-muted/50">
      <audio ref={audioPreviewRef} src={audioPreview} className="hidden"></audio>
      <div className="flex gap-2 w-full mb-2">
        <Button 
          type="button"
          variant="secondary" 
          size="sm"
          onClick={togglePlayPreview}
          className="flex-1 gap-2"
        >
          {isPlayingPreview ? (
            <><Pause className="h-4 w-4" /> Pause</>
          ) : (
            <><Play className="h-4 w-4" /> Play Preview</>
          )}
        </Button>
        <Button 
          type="button"
          variant="destructive" 
          size="sm"
          onClick={resetRecording}
          className="flex-shrink-0 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Recording length: {formatTime(recordingTime)}
      </p>
    </div>
  );
};
