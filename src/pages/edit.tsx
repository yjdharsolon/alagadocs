
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileAudio, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LocationState {
  transcription: string;
  audioInfo?: {
    audioUrl?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
  };
}

const EditPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState('');
  const [audioInfo, setAudioInfo] = useState<LocationState['audioInfo']>({});

  useEffect(() => {
    // Get the transcription data from the location state
    const state = location.state as LocationState;
    if (!state || !state.transcription) {
      toast.error('No transcription data provided');
      navigate('/upload');
      return;
    }
    
    setTranscription(state.transcription);
    if (state.audioInfo) {
      setAudioInfo(state.audioInfo);
    }
  }, [location, navigate]);

  const handleSave = () => {
    // In a real implementation, you might want to save the edited transcription
    // For now, we'll just navigate to the structured output page
    toast.success('Transcription updated');
    navigate('/structured-output', { 
      state: { transcription } 
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Transcription</CardTitle>
            <CardDescription>
              Review and edit the transcription for accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Audio file information */}
              {audioInfo?.fileName && (
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
              )}
              
              {/* Editable transcription */}
              <div className="space-y-2">
                <label htmlFor="transcription" className="text-sm font-medium">
                  Edit Transcription
                </label>
                <Textarea
                  id="transcription"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="The transcription appears here. Edit as needed."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save and Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default function EditPageWrapper() {
  return (
    <ProtectedRoute>
      <EditPage />
    </ProtectedRoute>
  );
}
