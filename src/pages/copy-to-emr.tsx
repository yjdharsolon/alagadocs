
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clipboard, CheckCircle2, FileDown } from 'lucide-react';
import { MedicalSections } from '@/components/structured-output/types';
import SectionContent from '@/components/structured-output/SectionContent';
import { formatClipboardText, exportAsPDF } from '@/components/structured-output/utils/exportUtils';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CopyToEMRPage() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Get the structured data from location state
  const sections = location.state?.sections as MedicalSections;
  
  const handleCopy = () => {
    if (!sections) {
      toast.error('No content available to copy');
      return;
    }
    
    const formattedText = formatClipboardText(sections);
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard! Ready to paste into your EMR system.');
        // Reset copied state after a delay
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
  const handleExport = () => {
    if (!sections) {
      toast.error('No content available to export');
      return;
    }
    
    setExporting(true);
    try {
      exportAsPDF(sections);
      toast.success('PDF export initiated');
    } catch (error) {
      toast.error('Error exporting PDF');
      console.error('PDF export error:', error);
    } finally {
      // Set exporting back to false after a delay
      setTimeout(() => setExporting(false), 1000);
    }
  };
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Copy to EMR</h1>
            <p className="text-muted-foreground mb-6">
              Copy your structured medical note to paste directly into your EMR system
            </p>
            
            <div className="flex flex-col gap-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex items-center gap-1"
                  disabled={!sections}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={exporting || !sections}
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
              
              {/* Document Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>
                    Review your document before copying to EMR
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections ? (
                    <>
                      <SectionContent title="Chief Complaint" content={sections.chiefComplaint} />
                      <SectionContent title="History of Present Illness" content={sections.historyOfPresentIllness} />
                      <SectionContent title="Past Medical History" content={sections.pastMedicalHistory} />
                      <SectionContent title="Medications" content={sections.medications} />
                      <SectionContent title="Allergies" content={sections.allergies} />
                      <SectionContent title="Physical Examination" content={sections.physicalExamination} />
                      <SectionContent title="Assessment" content={sections.assessment} />
                      <SectionContent title="Plan" content={sections.plan} />
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No content available. Please complete the transcription and structuring process first.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Click the "Copy to Clipboard" button above</li>
                    <li>Open your EMR system in another window</li>
                    <li>Place your cursor where you want to insert the note</li>
                    <li>Paste using Ctrl+V (Windows) or Cmd+V (Mac)</li>
                    <li>Review and submit according to your EMR system requirements</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
