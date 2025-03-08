
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileAudio, Check, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LocationState {
  audioUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
}

const TranscribePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [audioInfo, setAudioInfo] = useState<LocationState>({});

  useEffect(() => {
    // Get the audio information from the location state
    const state = location.state as LocationState;
    if (!state || !state.audioUrl) {
      toast.error('No audio file information provided');
      navigate('/upload');
      return;
    }
    
    setAudioInfo(state);
    
    // In a real application, you would call your transcription API here
    // For now, we'll simulate the transcription process
    startTranscription(state.audioUrl);
  }, [location, navigate]);

  const startTranscription = async (audioUrl: string) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your OpenAI Whisper API endpoint
      // For now, we'll simulate a delay and return a mock transcription
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // This is a placeholder. In the real implementation, 
      // we would get this from the API response
      setTranscription(
        "Patient presents with a two-day history of fever, sore throat, and general malaise. " +
        "Temperature is 101.3°F. Throat examination shows erythema and exudate. " +
        "No cervical lymphadenopathy. Lungs clear to auscultation. " +
        "Assessment: Likely viral pharyngitis. " +
        "Plan: Symptomatic treatment with rest, hydration, and acetaminophen for fever. " +
        "Follow up in three days if symptoms worsen or don't improve."
      );
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTranscription = () => {
    // Navigate to edit page with the transcription data
    navigate('/edit', { 
      state: { 
        transcription,
        audioInfo
      } 
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Audio Transcription</CardTitle>
            <CardDescription>
              Your audio is being processed and transcribed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Audio file information */}
              <div className="p-4 bg-gray-50 rounded-md flex items-start">
                <FileAudio className="h-8 w-8 text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">{audioInfo.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {audioInfo.fileSize && `${(audioInfo.fileSize / (1024 * 1024)).toFixed(2)} MB`}
                    {audioInfo.duration && ` • ${Math.floor(audioInfo.duration / 60)}:${(audioInfo.duration % 60).toString().padStart(2, '0')}`}
                  </p>
                </div>
              </div>
              
              {/* Transcription status */}
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                  <p className="mt-4 text-gray-600">Transcribing your audio...</p>
                  <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
                </div>
              ) : transcription ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <p className="font-medium text-green-600">Transcription Complete</p>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white">
                    <p className="text-gray-800 whitespace-pre-line">{transcription}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
          
          {!isLoading && transcription && (
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={handleEditTranscription}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Transcription
              </Button>
              <Button 
                onClick={() => navigate('/structured-output', { 
                  state: { transcription } 
                })}
              >
                Continue to Structured Output
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default function TranscribePageWrapper() {
  return (
    <ProtectedRoute>
      <TranscribePage />
    </ProtectedRoute>
  );
}
