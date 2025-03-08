
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileAudio, Play, Pause, SkipBack, SkipForward, Edit, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { transcribeAudio } from '@/services/transcriptionService';
import toast from 'react-hot-toast';

export default function TranscribePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Set up audio URL and start transcription
  useEffect(() => {
    const audioUrlFromState = location.state?.audioUrl;
    
    if (!audioUrlFromState) {
      toast.error('No audio file to transcribe. Please upload one first.');
      navigate('/upload');
      return;
    }
    
    setAudioUrl(audioUrlFromState);
    
    // Create audio element for playback
    const audio = new Audio(audioUrlFromState);
    setAudioElement(audio);
    
    // Set up audio element event listeners
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(Math.floor(audio.duration));
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(Math.floor(audio.currentTime));
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    });
    
    // Start transcription process
    startTranscription(audioUrlFromState);
    
    return () => {
      // Clean up audio element
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [location.state, navigate]);
  
  const startTranscription = async (url: string) => {
    try {
      setIsLoading(true);
      const text = await transcribeAudio(url);
      setTranscriptionText(text);
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Error transcribing audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Error playing audio. Please try again.');
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const skipBackward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  };
  
  const skipForward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.min(audioDuration, audioElement.currentTime + 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  };
  
  const handleStructuredOutput = () => {
    navigate('/structured-output', { 
      state: { transcriptionText, audioUrl } 
    });
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { transcriptionText, audioUrl } 
    });
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
                  This is the raw transcription. In the next step, you can convert this into a structured medical document or edit it as needed.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
