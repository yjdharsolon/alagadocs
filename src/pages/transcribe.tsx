
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';

const TranscribePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isStructuring, setIsStructuring] = useState<boolean>(false);
  
  const audioPath = location.state?.audioPath;
  
  useEffect(() => {
    if (!audioPath) {
      toast.error('No audio file provided');
      navigate('/upload');
      return;
    }
    
    // Start the transcription process automatically
    transcribeAudio();
  }, [audioPath]);
  
  const transcribeAudio = async () => {
    try {
      setIsTranscribing(true);
      
      // Simulating transcription with a timeout for now
      // In a real implementation, we would call the transcription API here
      setTimeout(() => {
        const sampleTranscription = "This is a sample transcription. Patient reports frequent headaches occurring 3-4 times per week, usually in the afternoon. Pain is described as throbbing and located primarily in the frontal region. Patient has tried over-the-counter pain relievers with minimal relief. No significant medical history. Recommended further evaluation and possible migraine prophylaxis.";
        setTranscription(sampleTranscription);
        setIsTranscribing(false);
        toast.success('Audio transcribed successfully!');
      }, 3000);
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsTranscribing(false);
      toast.error('Error transcribing audio');
    }
  };
  
  const handleStructureText = () => {
    setIsStructuring(true);
    
    // Simulating text structuring with a timeout for now
    setTimeout(() => {
      navigate('/structured-output', { 
        state: { 
          transcription: transcription 
        } 
      });
    }, 2000);
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        transcription: transcription 
      } 
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">AI Transcription</h1>
        
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Transcription Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isTranscribing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-center text-gray-600">Transcribing your audio...</p>
                <p className="mt-2 text-center text-sm text-gray-500">This may take a minute</p>
              </div>
            ) : (
              <Textarea 
                value={transcription} 
                onChange={(e) => setTranscription(e.target.value)}
                className="min-h-[300px] font-medium resize-none"
                placeholder="Transcription will appear here..."
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleEdit}
              disabled={isTranscribing || !transcription}
            >
              Edit Transcription
            </Button>
            <Button 
              onClick={handleStructureText}
              disabled={isTranscribing || !transcription || isStructuring}
            >
              {isStructuring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Structuring...
                </>
              ) : (
                'Structure Text'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default TranscribePage;
