
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ClipboardCopy, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LocationState {
  transcription: string;
}

const StructuredOutputPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalTranscription, setOriginalTranscription] = useState('');
  const [structuredNotes, setStructuredNotes] = useState<{
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

  useEffect(() => {
    // Get the transcription data from the location state
    const state = location.state as LocationState;
    if (!state || !state.transcription) {
      toast.error('No transcription data provided');
      navigate('/upload');
      return;
    }
    
    setOriginalTranscription(state.transcription);
    // Process the transcription to create structured notes
    processTranscription(state.transcription);
  }, [location, navigate]);

  const processTranscription = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call your GPT-4 API endpoint
      // For now, we'll simulate a delay and return a mock structured output
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This is a placeholder. In the real implementation,
      // we would get this from the API response
      setStructuredNotes({
        chiefComplaint: "Fever, sore throat, and general malaise for two days.",
        historyOfPresentIllness: "Patient presents with a two-day history of fever, sore throat, and general malaise. Temperature is 101.3°F. Throat examination shows erythema and exudate. No cervical lymphadenopathy. Lungs clear to auscultation.",
        assessment: "Likely viral pharyngitis.",
        plan: "Symptomatic treatment with rest, hydration, and acetaminophen for fever. Follow up in three days if symptoms worsen or don't improve."
      });
    } catch (error) {
      console.error('Error processing transcription:', error);
      toast.error('Failed to structure the transcription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFullStructuredNote = () => {
    return `CHIEF COMPLAINT:
${structuredNotes.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${structuredNotes.historyOfPresentIllness}

ASSESSMENT:
${structuredNotes.assessment}

PLAN:
${structuredNotes.plan}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Structured Medical Notes</CardTitle>
            <CardDescription>
              Your transcription has been formatted into structured medical notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                <p className="mt-4 text-gray-600">Processing transcription...</p>
                <p className="text-sm text-gray-400 mt-1">Creating structured medical notes</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Tabs defaultValue="structured" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="structured">Structured Format</TabsTrigger>
                    <TabsTrigger value="original">Original Transcription</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="structured" className="space-y-4">
                    <div className="space-y-4">
                      <section className="space-y-2">
                        <h3 className="text-md font-semibold">Chief Complaint</h3>
                        <div className="border rounded-md p-3 bg-white">
                          <p className="text-gray-800">{structuredNotes.chiefComplaint}</p>
                        </div>
                      </section>
                      
                      <section className="space-y-2">
                        <h3 className="text-md font-semibold">History of Present Illness</h3>
                        <div className="border rounded-md p-3 bg-white">
                          <p className="text-gray-800">{structuredNotes.historyOfPresentIllness}</p>
                        </div>
                      </section>
                      
                      <section className="space-y-2">
                        <h3 className="text-md font-semibold">Assessment</h3>
                        <div className="border rounded-md p-3 bg-white">
                          <p className="text-gray-800">{structuredNotes.assessment}</p>
                        </div>
                      </section>
                      
                      <section className="space-y-2">
                        <h3 className="text-md font-semibold">Plan</h3>
                        <div className="border rounded-md p-3 bg-white">
                          <p className="text-gray-800">{structuredNotes.plan}</p>
                        </div>
                      </section>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="original">
                    <div className="border rounded-md p-4 bg-white">
                      <p className="text-gray-800 whitespace-pre-line">{originalTranscription}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          
          {!isProcessing && (
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/edit', { 
                  state: { transcription: originalTranscription } 
                })}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Transcription
              </Button>
              <Button 
                onClick={() => copyToClipboard(getFullStructuredNote())}
                className="flex items-center gap-2"
              >
                <ClipboardCopy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default function StructuredOutputPageWrapper() {
  return (
    <ProtectedRoute>
      <StructuredOutputPage />
    </ProtectedRoute>
  );
}
