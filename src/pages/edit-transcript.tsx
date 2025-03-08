
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { MedicalSections } from '@/components/structured-output/types';

const EditTranscriptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState<string>('');
  const [structuredSections, setStructuredSections] = useState<MedicalSections | null>(null);
  
  useEffect(() => {
    const { transcription, structuredText } = location.state || {};
    
    if (!transcription) {
      toast.error('No transcription provided');
      navigate('/upload');
      return;
    }
    
    setTranscription(transcription);
    if (structuredText) {
      setStructuredSections(structuredText);
    }
  }, [location.state]);
  
  const handleSaveTranscription = () => {
    if (structuredSections) {
      navigate('/structured-output', { 
        state: { 
          transcription, 
          structuredText: structuredSections,
          timestamp: new Date().toISOString()
        } 
      });
    } else {
      navigate('/transcribe', { state: { transcription } });
    }
    toast.success('Changes saved!');
  };
  
  const handleStructureText = () => {
    navigate('/structured-output', { state: { transcription } });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Transcription</h1>
        
        {!structuredSections ? (
          // Edit raw transcription
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Raw Transcription</CardTitle>
              <CardDescription>
                Make any necessary corrections to the transcribed text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={transcription} 
                onChange={(e) => setTranscription(e.target.value)}
                className="min-h-[300px] font-medium"
                placeholder="Edit your transcription here..."
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/transcribe', { state: { audioPath: 'previous' } })}
              >
                Cancel
              </Button>
              <div className="space-x-2">
                <Button 
                  onClick={handleSaveTranscription}
                  variant="secondary"
                >
                  Save
                </Button>
                <Button 
                  onClick={handleStructureText}
                >
                  Structure Text
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          // Edit structured text
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Edit Structured Notes</CardTitle>
              <CardDescription>
                Make any necessary corrections to the structured medical notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input 
                  id="chiefComplaint"
                  value={structuredSections.chiefComplaint} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    chiefComplaint: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
                <Textarea 
                  id="historyOfPresentIllness"
                  value={structuredSections.historyOfPresentIllness} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    historyOfPresentIllness: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pastMedicalHistory">Past Medical History</Label>
                <Textarea 
                  id="pastMedicalHistory"
                  value={structuredSections.pastMedicalHistory} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    pastMedicalHistory: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Medications</Label>
                <Textarea 
                  id="medications"
                  value={structuredSections.medications} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    medications: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies"
                  value={structuredSections.allergies} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    allergies: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="physicalExamination">Physical Examination</Label>
                <Textarea 
                  id="physicalExamination"
                  value={structuredSections.physicalExamination} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    physicalExamination: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assessment">Assessment</Label>
                <Textarea 
                  id="assessment"
                  value={structuredSections.assessment} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    assessment: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Textarea 
                  id="plan"
                  value={structuredSections.plan} 
                  onChange={(e) => setStructuredSections({
                    ...structuredSections,
                    plan: e.target.value
                  })}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/structured-output', { 
                  state: { transcription, structuredText: location.state.structuredText } 
                })}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTranscription}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default EditTranscriptPage;
