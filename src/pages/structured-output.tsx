
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StructuredOutputPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [structuredText, setStructuredText] = useState<{
    chiefComplaint: string;
    historyOfPresentIllness: string;
    assessment: string;
    plan: string;
  }>({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    assessment: '',
    plan: ''
  });
  
  const transcription = location.state?.transcription;
  
  useEffect(() => {
    if (!transcription) {
      toast.error('No transcription provided');
      navigate('/upload');
      return;
    }
    
    // In a real implementation, we would call the GPT API to structure the text
    // For now, we'll create a simple structured version
    structureText(transcription);
  }, [transcription]);
  
  const structureText = (text: string) => {
    // This is a simplified example; in a real implementation,
    // we would use GPT-4 to properly structure the text
    setStructuredText({
      chiefComplaint: 'Frequent headaches',
      historyOfPresentIllness: 'Patient reports frequent headaches occurring 3-4 times per week, usually in the afternoon. Pain is described as throbbing and located primarily in the frontal region. Patient has tried over-the-counter pain relievers with minimal relief.',
      assessment: 'Possible migraine or tension headache. No significant medical history that would suggest secondary causes.',
      plan: 'Recommended further evaluation and possible migraine prophylaxis. Consider amitriptyline 10mg daily. Follow up in 2 weeks.'
    });
  };
  
  const copyToClipboard = () => {
    const fullText = `
CHIEF COMPLAINT:
${structuredText.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${structuredText.historyOfPresentIllness}

ASSESSMENT:
${structuredText.assessment}

PLAN:
${structuredText.plan}
    `.trim();
    
    navigator.clipboard.writeText(fullText)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        structuredText: structuredText,
        transcription: transcription
      } 
    });
  };
  
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
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="cc">Chief Complaint</TabsTrigger>
                <TabsTrigger value="hpi">HPI</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6 mt-4">
                <section>
                  <h3 className="text-lg font-bold mb-2">CHIEF COMPLAINT:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.chiefComplaint}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2">HISTORY OF PRESENT ILLNESS:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.historyOfPresentIllness}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2">ASSESSMENT:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.assessment}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2">PLAN:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.plan}
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="cc">
                <section className="mt-4">
                  <h3 className="text-lg font-bold mb-2">CHIEF COMPLAINT:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.chiefComplaint}
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="hpi">
                <section className="mt-4">
                  <h3 className="text-lg font-bold mb-2">HISTORY OF PRESENT ILLNESS:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.historyOfPresentIllness}
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="assessment">
                <section className="mt-4">
                  <h3 className="text-lg font-bold mb-2">ASSESSMENT:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.assessment}
                  </p>
                </section>
              </TabsContent>
              
              <TabsContent value="plan">
                <section className="mt-4">
                  <h3 className="text-lg font-bold mb-2">PLAN:</h3>
                  <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
                    {structuredText.plan}
                  </p>
                </section>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleEdit}
            >
              Edit
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
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default StructuredOutputPage;
