
import React from 'react';
import { formatTime } from '../utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  audioDuration: number;
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  audioDuration,
  isLoading
}) => {
  return (
    <>
      <div className="text-center text-sm">
        {isLoading ? "Loading..." : `${formatTime(currentTime)} / ${formatTime(audioDuration)}`}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all" 
          style={{ width: `${audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;
