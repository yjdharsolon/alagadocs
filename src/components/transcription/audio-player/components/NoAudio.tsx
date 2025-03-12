
import React from 'react';

const NoAudio: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <p className="text-muted-foreground text-center">No audio available for this transcription</p>
    </div>
  );
};

export default NoAudio;
