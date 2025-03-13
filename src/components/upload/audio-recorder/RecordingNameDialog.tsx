
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RecordingNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileName: string) => void;
  defaultName: string;
}

export const RecordingNameDialog: React.FC<RecordingNameDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultName
}) => {
  const [fileName, setFileName] = useState(defaultName);

  const handleSave = () => {
    // Use trimmed input, or default name if empty
    const trimmedName = fileName.trim();
    onSave(trimmedName || defaultName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name Your Recording</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recording-name">Recording Name</Label>
            <Input
              id="recording-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter a name for your recording"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Use Default Name
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
