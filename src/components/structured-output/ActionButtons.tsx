
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, CheckCircle2, Save, Loader2, Pencil, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveStructuredNote } from '@/services/transcriptionService';
import { MedicalSections } from './types';

interface ActionButtonsProps {
  user: any;
  sections: MedicalSections;
  structuredText: string;
  handleEdit: () => void;
}

const ActionButtons = ({ user, sections, structuredText, handleEdit }: ActionButtonsProps) => {
  const [copied, setCopied] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  
  const copyToClipboard = () => {
    // Format the text nicely for clipboard
    const formattedText = [
      'CHIEF COMPLAINT:',
      sections.chiefComplaint,
      '\nHISTORY OF PRESENT ILLNESS:',
      sections.historyOfPresentIllness,
      '\nPAST MEDICAL HISTORY:',
      sections.pastMedicalHistory,
      '\nMEDICATIONS:',
      sections.medications,
      '\nALLERGIES:',
      sections.allergies,
      '\nPHYSICAL EXAMINATION:',
      sections.physicalExamination,
      '\nASSESSMENT:',
      sections.assessment,
      '\nPLAN:',
      sections.plan
    ].join('\n');
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const handleSaveNote = async () => {
    if (!user) {
      toast.error('You must be logged in to save notes');
      return;
    }
    
    try {
      setSaving(true);
      // Generate a title from the chief complaint or first line
      const title = sections.chiefComplaint.substring(0, 50) || 'Medical Note';
      
      await saveStructuredNote(user.id, title, structuredText);
      toast.success('Note saved successfully!');
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast.error(error.message || 'Error saving note');
    } finally {
      setSaving(false);
    }
  };
  
  const exportAsPDF = () => {
    setExporting(true);
    
    // For now, just simulate PDF generation
    // In a real implementation, you would use a library like jsPDF or react-pdf
    setTimeout(() => {
      const blob = new Blob(
        [
          `MEDICAL DOCUMENTATION
          
CHIEF COMPLAINT:
${sections.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${sections.historyOfPresentIllness}

PAST MEDICAL HISTORY:
${sections.pastMedicalHistory}

MEDICATIONS:
${sections.medications}

ALLERGIES:
${sections.allergies}

PHYSICAL EXAMINATION:
${sections.physicalExamination}

ASSESSMENT:
${sections.assessment}

PLAN:
${sections.plan}
          `
        ], 
        { type: 'text/plain' }
      );
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical_note_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setExporting(false);
      toast.success('Document exported!');
    }, 1000);
  };
  
  return (
    <div className="flex justify-between w-full flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={handleEdit}
        className="flex items-center gap-1"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={exportAsPDF}
          disabled={exporting}
          className="flex items-center gap-1"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Export
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSaveNote}
          disabled={saving || !user}
          className="flex items-center gap-1"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Note
            </>
          )}
        </Button>
        
        <Button
          onClick={copyToClipboard}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" />
              Copy to EMR
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
