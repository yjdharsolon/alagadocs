
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface PatientRecordsTableProps {
  patientNotes: any[];
}

export const PatientRecordsTable: React.FC<PatientRecordsTableProps> = ({
  patientNotes
}) => {
  const navigate = useNavigate();

  const handleViewNote = (noteId: string) => {
    navigate(`/structured-output?noteId=${noteId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Content Preview</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientNotes.map((note) => {
          const sections = note.content || {};
          const firstSection = Object.values(sections)[0] as string || '';
          const preview = firstSection.substring(0, 60) + (firstSection.length > 60 ? '...' : '');
          
          return (
            <TableRow key={note.id}>
              <TableCell>
                {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>{preview || 'No content'}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewNote(note.id)}
                >
                  <File className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
