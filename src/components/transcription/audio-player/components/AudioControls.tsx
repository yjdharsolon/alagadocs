
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
    <div className="flex justify-center items-center gap-2" role="toolbar" aria-label="Audio playback controls">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={skipBackward} 
        title="Skip backward 10s (Left arrow)" 
        disabled={disabled}
        aria-label="Skip backward 10 seconds"
        className="border-[#E0E0E0] hover:bg-[#33C3F0]/10 hover:border-[#33C3F0] transition-colors duration-200"
      >
        <SkipBack className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button 
        size="icon" 
        className="h-10 w-10 rounded-full bg-[#33C3F0] hover:bg-[#1EAEDB] text-white transition-colors duration-200" 
        onClick={togglePlayPause} 
        title="Play/Pause (Space)"
        disabled={disabled || hasError}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={skipForward} 
        title="Skip forward 10s (Right arrow)" 
        disabled={disabled}
        aria-label="Skip forward 10 seconds"
        className="border-[#E0E0E0] hover:bg-[#33C3F0]/10 hover:border-[#33C3F0] transition-colors duration-200"
      >
        <SkipForward className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={downloadAudio} 
        title="Download audio" 
        disabled={disabled || is403Error}
        aria-label="Download audio file"
        className="border-[#E0E0E0] hover:bg-[#33C3F0]/10 hover:border-[#33C3F0] transition-colors duration-200"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default AudioControls;
