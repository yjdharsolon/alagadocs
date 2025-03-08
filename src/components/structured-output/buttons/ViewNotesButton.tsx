
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { List, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewNotesButton = () => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-1"
        >
          <List className="h-4 w-4" />
          View All Notes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <List className="h-4 w-4 mr-2" />
          Saved Notes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/templates')}>
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewNotesButton;
