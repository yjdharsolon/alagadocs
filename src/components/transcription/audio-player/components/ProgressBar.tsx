
import React from 'react';
import { formatTime } from '../utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  audioDuration: number;
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, audioDuration, isLoading }) => {
  // Ensure we have a valid duration value
  // If audioDuration is NaN, Infinity, or less than 0, estimate based on currentTime
  const effectiveDuration = isFinite(audioDuration) && audioDuration > 0 
    ? audioDuration 
    : Math.max(currentTime + 10, 30); // Estimate: current position + 10 seconds, minimum 30 seconds
  
  // Calculate progress percentage
  const progressPercentage = effectiveDuration > 0 
    ? (currentTime / effectiveDuration) * 100 
    : 0;
  
  // Format the time display
  const currentTimeDisplay = formatTime(currentTime);
  const durationDisplay = isFinite(audioDuration) && audioDuration > 0
    ? formatTime(audioDuration)
    : isLoading 
      ? '--:--' 
      : `~${formatTime(effectiveDuration)}`; // Show approximate duration with ~ prefix
  
  return (
    <div className="space-y-1">
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary rounded-full"
          style={{ 
            width: `${progressPercentage}%`, 
            transition: 'width 0.1s linear, transform 0.1s ease-out',
            willChange: 'width',
            transform: 'translateZ(0)'
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{currentTimeDisplay}</span>
        <span>{durationDisplay}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
