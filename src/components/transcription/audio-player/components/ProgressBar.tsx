
import React from 'react';
import { formatTime } from '../utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  audioDuration: number;
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, audioDuration, isLoading }) => {
  // Provide a fallback duration for recorded audio if needed
  const effectiveDuration = isFinite(audioDuration) && audioDuration > 0 
    ? audioDuration 
    : 0;
  
  // Calculate progress percentage
  const progressPercentage = effectiveDuration > 0 
    ? (currentTime / effectiveDuration) * 100 
    : 0;
  
  // Format the time display
  const currentTimeDisplay = formatTime(currentTime);
  const durationDisplay = formatTime(effectiveDuration);
  
  return (
    <div className="space-y-1">
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${progressPercentage}%`, 
            transition: 'width 0.3s ease-in-out' 
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{currentTimeDisplay}</span>
        <span>{isLoading ? '--:--' : durationDisplay}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
