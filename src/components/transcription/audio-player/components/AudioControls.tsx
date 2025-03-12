
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  skipBackward: () => void;
  skipForward: () => void;
  downloadAudio: () => void;
  disabled: boolean;
  hasError: boolean;
  is403Error: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  togglePlayPause,
  skipBackward,
  skipForward,
  downloadAudio,
  disabled,
  hasError,
  is403Error
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={skipBackward} 
        title="Skip backward 10s (Left arrow)" 
        disabled={disabled}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button 
        size="icon" 
        className="h-10 w-10 rounded-full" 
        onClick={togglePlayPause} 
        title="Play/Pause (Space)"
        disabled={disabled || hasError}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={skipForward} 
        title="Skip forward 10s (Right arrow)" 
        disabled={disabled}
      >
        <SkipForward className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={downloadAudio} 
        title="Download audio" 
        disabled={disabled || is403Error}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AudioControls;
