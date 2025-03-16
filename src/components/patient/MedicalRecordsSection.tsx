
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Stethoscope, File, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface MedicalRecordsSectionProps {
  loading: boolean;
  patientNotes: any[];
  onStartConsultation: () => void;
}

export const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  loading,
  patientNotes,
  onStartConsultation
}) => {
  const navigate = useNavigate();

  const handleViewNote = (noteId: string) => {
    navigate(`/structured-output?noteId=${noteId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical Records</CardTitle>
        <Button onClick={onStartConsultation}>
          <Stethoscope className="mr-2 h-4 w-4" />
          Start New Consultation
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : patientNotes.length > 0 ? (
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No medical records available for this patient.</p>
            <Button 
              onClick={onStartConsultation} 
              variant="outline" 
              className="mt-2"
            >
              Create First Record
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
