
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileAudio, Play, Pause, SkipBack, SkipForward, Edit, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mocked transcription result for now
// In the actual implementation, this would come from the AI transcription service
const mockTranscription = `
Patient presents with complaints of persistent headaches lasting for the past 3 weeks. The headaches are described as throbbing in nature, primarily located in the frontal and temporal regions. Pain is rated as 7 out of 10 on the pain scale. Patient reports that headaches are worse in the morning and are sometimes accompanied by nausea. No vomiting reported. Patient has tried over-the-counter pain medications with minimal relief. No history of migraines. Patient mentions increased stress at work recently. Vital signs are within normal limits. Neurological examination shows no abnormalities. Recommended an MRI to rule out any structural issues and prescribed sumatriptan 50mg for acute episodes. Follow-up in 2 weeks.
`;

export default function TranscribePage() {
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const navigate = useNavigate();

  // Simulate loading the transcription
  useEffect(() => {
    const timer = setTimeout(() => {
      setTranscriptionText(mockTranscription);
      setIsLoading(false);
      setAudioDuration(120); // Mock 2 minutes of audio
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate audio playback for demo
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying && currentTime < audioDuration) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= audioDuration) {
            setIsPlaying(false);
            return audioDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentTime, audioDuration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(audioDuration, prev + 10));
  };

  const handleStructuredOutput = () => {
    navigate('/structured-output');
  };

  const handleEdit = () => {
    navigate('/edit-transcript');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Transcription Result</h1>
          <p className="text-muted-foreground mb-6">
            Review your audio transcription before structuring or editing
          </p>
          
          <div className="grid gap-6">
            {/* Audio Player Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="h-5 w-5" />
                  Audio Player
                </CardTitle>
                <CardDescription>
                  Listen to your audio while reviewing the transcription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center items-center gap-4">
                    <Button variant="outline" size="icon" onClick={skipBackward}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="h-12 w-12 rounded-full" onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={skipForward}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <span className="text-sm">{formatTime(audioDuration)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${(currentTime / audioDuration) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Transcription Text Card */}
            <Card>
              <CardHeader>
                <CardTitle>Transcription</CardTitle>
                <CardDescription>
                  Raw transcription of your audio file
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[75%]" />
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto p-4 bg-slate-50 rounded-lg">
                    <p className="whitespace-pre-line">{transcriptionText}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleStructuredOutput}
                  disabled={isLoading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Structure Content
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Transcription
                </Button>
              </CardFooter>
            </Card>
            
            {!isLoading && (
              <Alert>
                <AlertDescription>
                  This is a preview of the basic transcription. In the next step, you can convert this into a structured medical document.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
