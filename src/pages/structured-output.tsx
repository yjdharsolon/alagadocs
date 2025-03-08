
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { structureText, saveStructuredNote } from '@/services/transcriptionService';

const StructuredOutputPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [structuredText, setStructuredText] = useState<string>('');
  const [sections, setSections] = useState<{[key: string]: string}>({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: '',
    plan: ''
  });
  
  const transcription = location.state?.transcription;
  const userRole = location.state?.userRole || localStorage.getItem('userRole') || 'doctor';
  
  useEffect(() => {
    if (!transcription) {
      toast.error('No transcription provided');
      navigate('/upload');
      return;
    }
    
    // Call the GPT API to structure the text
    generateStructuredText();
  }, [transcription]);
  
  const generateStructuredText = async () => {
    try {
      setLoading(true);
      const result = await structureText(transcription, userRole);
      setStructuredText(result);
      
      // Parse the structured text into sections
      parseStructuredText(result);
      
      toast.success('Text structured successfully!');
    } catch (error: any) {
      console.error('Error structuring text:', error);
      toast.error(error.message || 'Error structuring text');
    } finally {
      setLoading(false);
    }
  };
  
  const parseStructuredText = (text: string) => {
    // Basic parsing of headers and content
    const parsedSections: {[key: string]: string} = {
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      medications: '',
      allergies: '',
      physicalExamination: '',
      assessment: '',
      plan: ''
    };
    
    // Simple regex-based parsing for each section
    // Chief Complaint
    const ccMatch = text.match(/chief complaint:?([^#]+)/i);
    if (ccMatch) parsedSections.chiefComplaint = ccMatch[1].trim();
    
    // History of Present Illness
    const hpiMatch = text.match(/history of present illness:?([^#]+)/i);
    if (hpiMatch) parsedSections.historyOfPresentIllness = hpiMatch[1].trim();
    
    // Past Medical History
    const pmhMatch = text.match(/past medical history:?([^#]+)/i);
    if (pmhMatch) parsedSections.pastMedicalHistory = pmhMatch[1].trim();
    
    // Medications
    const medMatch = text.match(/medications:?([^#]+)/i);
    if (medMatch) parsedSections.medications = medMatch[1].trim();
    
    // Allergies
    const allergyMatch = text.match(/allergies:?([^#]+)/i);
    if (allergyMatch) parsedSections.allergies = allergyMatch[1].trim();
    
    // Physical Examination
    const peMatch = text.match(/physical examination:?([^#]+)/i);
    if (peMatch) parsedSections.physicalExamination = peMatch[1].trim();
    
    // Assessment
    const assessMatch = text.match(/assessment:?([^#]+)/i);
    if (assessMatch) parsedSections.assessment = assessMatch[1].trim();
    
    // Plan
    const planMatch = text.match(/plan:?([^#]+)/i);
    if (planMatch) parsedSections.plan = planMatch[1].trim();
    
    setSections(parsedSections);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(structuredText)
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
      const title = sections.chiefComplaint || 'Medical Note';
      
      await saveStructuredNote(user.id, title, structuredText);
      toast.success('Note saved successfully!');
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast.error(error.message || 'Error saving note');
    } finally {
      setSaving(false);
    }
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        structuredText,
        transcription,
        userRole
      } 
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Structuring your medical note...</h2>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Structured Medical Notes</h1>
        
        <Card className="w-full max-w-3xl mx-auto mb-6">
          <CardHeader>
            <CardTitle>Formatted Medical Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="cc-hpi">CC & HPI</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {sections.chiefComplaint && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">CHIEF COMPLAINT:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.chiefComplaint}
                    </p>
                  </section>
                )}
                
                {sections.historyOfPresentIllness && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">HISTORY OF PRESENT ILLNESS:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.historyOfPresentIllness}
                    </p>
                  </section>
                )}
                
                {sections.pastMedicalHistory && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">PAST MEDICAL HISTORY:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.pastMedicalHistory}
                    </p>
                  </section>
                )}
                
                {sections.medications && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">MEDICATIONS:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.medications}
                    </p>
                  </section>
                )}
                
                {sections.allergies && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">ALLERGIES:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.allergies}
                    </p>
                  </section>
                )}
                
                {sections.physicalExamination && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">PHYSICAL EXAMINATION:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.physicalExamination}
                    </p>
                  </section>
                )}
                
                {sections.assessment && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">ASSESSMENT:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.assessment}
                    </p>
                  </section>
                )}
                
                {sections.plan && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">PLAN:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.plan}
                    </p>
                  </section>
                )}
              </TabsContent>
              
              <TabsContent value="cc-hpi">
                {sections.chiefComplaint && (
                  <section className="mb-4">
                    <h3 className="text-lg font-bold mb-2">CHIEF COMPLAINT:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.chiefComplaint}
                    </p>
                  </section>
                )}
                
                {sections.historyOfPresentIllness && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">HISTORY OF PRESENT ILLNESS:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.historyOfPresentIllness}
                    </p>
                  </section>
                )}
              </TabsContent>
              
              <TabsContent value="assessment">
                {sections.assessment && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">ASSESSMENT:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.assessment}
                    </p>
                  </section>
                )}
              </TabsContent>
              
              <TabsContent value="plan">
                {sections.plan && (
                  <section>
                    <h3 className="text-lg font-bold mb-2">PLAN:</h3>
                    <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                      {sections.plan}
                    </p>
                  </section>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleEdit}
            >
              Edit
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveNote}
                disabled={saving || !user}
                className="flex items-center gap-2"
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
                className="flex items-center gap-2"
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
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default StructuredOutputPage;
