import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, CheckCircle2, Save, Loader2, Pencil, FileDown, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveStructuredNote } from '@/services/transcriptionService';
import { MedicalSections } from './types';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  onCopy: () => void;
  onEdit: () => void;
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
}

const ActionButtons = ({ onCopy, onEdit, user, sections, structuredText }: ActionButtonsProps) => {
  const [copied, setCopied] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const navigate = useNavigate();
  
  const handleSaveNote = async () => {
    if (!user || !sections || !structuredText) {
      toast.error('Missing required data to save note');
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
  
  const handleCopy = () => {
    setCopied(true);
    onCopy();
    // Reset copied state after a delay
    setTimeout(() => setCopied(false), 2000);
  };
  
  const exportAsPDF = () => {
    if (!sections) {
      toast.error('No data to export');
      return;
    }
    
    setExporting(true);
    
    try {
      // Create a hidden iframe to generate the PDF-like document
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.top = '-9999px';
      printFrame.style.left = '-9999px';
      document.body.appendChild(printFrame);
      
      // Generate HTML content with proper styling for PDF
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Documentation</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 30px;
                color: #333;
              }
              h1 {
                text-align: center;
                color: #2563eb;
                margin-bottom: 20px;
              }
              h2 {
                color: #1d4ed8;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
                margin-top: 20px;
              }
              .date {
                text-align: right;
                margin-bottom: 20px;
                color: #666;
              }
              .section {
                margin-bottom: 15px;
              }
              .content {
                white-space: pre-line;
                padding-left: 10px;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 15px;
                }
                h1, h2 {
                  page-break-after: avoid;
                }
                .section {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <h1>Medical Documentation</h1>
            <div class="date">Date: ${new Date().toLocaleDateString()}</div>
            
            <div class="section">
              <h2>CHIEF COMPLAINT</h2>
              <div class="content">${sections.chiefComplaint || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>HISTORY OF PRESENT ILLNESS</h2>
              <div class="content">${sections.historyOfPresentIllness || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>PAST MEDICAL HISTORY</h2>
              <div class="content">${sections.pastMedicalHistory || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>MEDICATIONS</h2>
              <div class="content">${sections.medications || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>ALLERGIES</h2>
              <div class="content">${sections.allergies || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>PHYSICAL EXAMINATION</h2>
              <div class="content">${sections.physicalExamination || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>ASSESSMENT</h2>
              <div class="content">${sections.assessment || 'None documented'}</div>
            </div>
            
            <div class="section">
              <h2>PLAN</h2>
              <div class="content">${sections.plan || 'None documented'}</div>
            </div>
          </body>
        </html>
      `;
      
      // Write the HTML content to the iframe
      const frameDoc = printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(content);
        frameDoc.close();
        
        // Wait for content to load then print
        setTimeout(() => {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          
          // Clean up after printing is done
          printFrame.onload = () => {
            document.body.removeChild(printFrame);
            setExporting(false);
            toast.success('Document exported for printing/saving as PDF');
          };
        }, 500);
      } else {
        throw new Error('Could not access frame document');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExporting(false);
      toast.error('Error exporting document');
      
      // Fallback to text export if print fails
      const blob = new Blob(
        [
          `MEDICAL DOCUMENTATION
          
CHIEF COMPLAINT:
${sections?.chiefComplaint || 'None documented'}

HISTORY OF PRESENT ILLNESS:
${sections?.historyOfPresentIllness || 'None documented'}

PAST MEDICAL HISTORY:
${sections?.pastMedicalHistory || 'None documented'}

MEDICATIONS:
${sections?.medications || 'None documented'}

ALLERGIES:
${sections?.allergies || 'None documented'}

PHYSICAL EXAMINATION:
${sections?.physicalExamination || 'None documented'}

ASSESSMENT:
${sections?.assessment || 'None documented'}

PLAN:
${sections?.plan || 'None documented'}
          `
        ], 
        { type: 'text/plain' }
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical_note_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document exported as text file (fallback mode)');
    }
  };
  
  const handleViewAllNotes = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="flex justify-between w-full flex-wrap gap-2">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleViewAllNotes}
          className="flex items-center gap-1"
        >
          <List className="h-4 w-4" />
          View All Notes
        </Button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={exportAsPDF}
          disabled={exporting || !sections}
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
              Export as PDF
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSaveNote}
          disabled={saving || !user || !sections || !structuredText}
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
          onClick={handleCopy}
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
