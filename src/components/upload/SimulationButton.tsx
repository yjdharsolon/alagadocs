
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface SimulationButtonProps {
  onSimulate: () => void;
  disabled: boolean;
  isSimulating: boolean;
}

export const SimulationButton: React.FC<SimulationButtonProps> = ({ 
  onSimulate, 
  disabled, 
  isSimulating 
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <Button
        variant="outline"
        type="button"
        onClick={onSimulate}
        disabled={disabled || isSimulating}
        className="w-full flex items-center justify-center gap-2"
      >
        <Play className="h-4 w-4" />
        {isSimulating ? 'Simulating...' : 'Simulate Recording & Upload'}
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        This will create a mock audio file and attempt the upload process
      </p>
    </div>
  );
};
