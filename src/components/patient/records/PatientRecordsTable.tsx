
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { formatContent } from '@/components/structured-output/utils/contentFormatter';
import { Badge } from '@/components/ui/badge';

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

  /**
   * Formats the note type for display
   */
  const formatNoteType = (formatType: string | null): string => {
    if (!formatType) return 'Standard';
    
    // Map format types to display names
    const formatDisplayNames: Record<string, string> = {
      'standard': 'Standard',
      'history': 'H&P',
      'soap': 'SOAP Note',
      'consultation': 'Consultation',
      'prescription': 'Prescription'
    };
    
    return formatDisplayNames[formatType.toLowerCase()] || 
           formatType.charAt(0).toUpperCase() + formatType.slice(1);
  };

  /**
   * Creates a preview of content, safely handling different data types
   */
  const createContentPreview = (content: any): string => {
    if (!content) return 'No content';
    
    try {
      // Handle different content formats
      if (typeof content === 'string') {
        return content.substring(0, 60) + (content.length > 60 ? '...' : '');
      }
      
      // For objects, find the first non-empty value to display
      if (typeof content === 'object') {
        // Special handling for prescription format
        if (content.medications || content.patientInformation) {
          if (content.medications && Array.isArray(content.medications) && content.medications.length > 0) {
            const med = content.medications[0];
            const medName = med.genericName || med.name || 'Medication';
            return `Prescription: ${medName}` + (content.medications.length > 1 ? ` (+${content.medications.length - 1} more)` : '');
          }
          return 'Prescription';
        }
        
        // Standard format (SOAP, etc.)
        const keys = Object.keys(content);
        for (const key of keys) {
          if (content[key] && typeof content[key] === 'string' && content[key].trim() !== '') {
            return content[key].substring(0, 60) + (content[key].length > 60 ? '...' : '');
          }
        }
      }
      
      return 'Content available';
    } catch (error) {
      console.error('Error creating content preview:', error);
      return 'Error displaying content';
    }
  };

  // Log to see actual format types in the data
  React.useEffect(() => {
    console.log('Patient notes:', patientNotes);
    if (patientNotes.length > 0) {
      console.log('Format types in notes:', patientNotes.map(note => note.format_type));
    }
  }, [patientNotes]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Content Preview</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientNotes.map((note) => {
          const preview = createContentPreview(note.content);
          const formattedType = formatNoteType(note.format_type);
          
          return (
            <TableRow key={note.id}>
              <TableCell>
                {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {formattedType}
                </Badge>
              </TableCell>
              <TableCell>{preview}</TableCell>
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
