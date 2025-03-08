
import React from 'react';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewNotesButton = () => {
  const navigate = useNavigate();
  
  const handleViewAllNotes = () => {
    navigate('/dashboard');
  };
  
  return (
    <Button 
      variant="outline"
      onClick={handleViewAllNotes}
      className="flex items-center gap-1"
    >
      <List className="h-4 w-4" />
      View All Notes
    </Button>
  );
};

export default ViewNotesButton;
