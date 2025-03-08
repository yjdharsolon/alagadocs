import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { saveStructuredNote } from '@/services/noteService';

interface SaveNoteButtonProps {
  title: string;
  content: string;
  onSaveSuccess: () => void;
}

const SaveNoteButton: React.FC<SaveNoteButtonProps> = ({ title, content, onSaveSuccess }) => {
  const { user } = useAuth();

  const handleSaveNote = async () => {
    if (!user) {
      toast.error('Please sign in to save notes.');
      return;
    }

    try {
      await saveStructuredNote(user.id, title, content);
      toast.success('Note saved successfully!');
      onSaveSuccess();
    } catch (error: any) {
      toast.error(`Failed to save note: ${error.message}`);
    }
  };

  return (
    <Button onClick={handleSaveNote} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      <Save className="mr-2 h-4 w-4" />
      Save Note
    </Button>
  );
};

export default SaveNoteButton;
