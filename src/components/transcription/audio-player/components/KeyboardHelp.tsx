
import React from 'react';

const KeyboardHelp: React.FC = () => {
  return (
    <div 
      className="text-xs text-muted-foreground text-center" 
      aria-live="polite" 
      role="status"
    >
      <span className="sr-only">Keyboard shortcuts available:</span>
      Keyboard shortcuts: Space (play/pause), ← (backward), → (forward)
    </div>
  );
};

export default KeyboardHelp;
