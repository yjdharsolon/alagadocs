
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TextPreviewModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onContinue: () => void;
}

export const TextPreviewModal: React.FC<TextPreviewModalProps> = ({
  isOpen,
  content,
  onClose,
  onContinue,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview Your Text</DialogTitle>
          <DialogDescription>
            Review your text before proceeding to the next step
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-[50vh] rounded-md border p-4">
            <div className="whitespace-pre-wrap">{content}</div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button variant="outline" onClick={onClose}>
            Edit Text
          </Button>
          <Button onClick={onContinue}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
