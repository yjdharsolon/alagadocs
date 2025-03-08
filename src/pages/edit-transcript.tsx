
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, SkipBack, SkipForward, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditTranscriptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Set up from location state
  useEffect(() => {
    const textFromState = location.state?.transcriptionText;
    const audioUrlFromState = location.state?.audioUrl;
    
    if (!textFromState || !audioUrlFromState) {
      toast.error('No transcription to edit. Please transcribe audio first.');
      navigate('/upload');
      return;
    }
    
    setTranscriptionText(textFromState);
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
    
    return () => {
      // Clean up audio element
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [location.state, navigate]);
  
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
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving with a timeout
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Transcription saved successfully');
    }, 1000);
  };
  
  const handleContinueToStructured = () => {
    navigate('/structured-output', { 
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
          <h1 className="text-3xl font-bold mb-2">Edit Transcription</h1>
          <p className="text-muted-foreground mb-6">
            Review and edit your transcription while listening to the audio
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Audio Player */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Audio Player</CardTitle>
                <CardDescription>
                  Listen while you edit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center items-center gap-2">
                  <Button variant="outline" size="icon" onClick={skipBackward}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={skipForward}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {formatTime(currentTime)} / {formatTime(audioDuration)}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(currentTime / audioDuration) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            
            {/* Transcription Editor */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Transcription</CardTitle>
                <CardDescription>
                  Make any corrections needed to the transcribed text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="min-h-[400px] font-mono text-sm"
                  value={transcriptionText}
                  onChange={(e) => setTranscriptionText(e.target.value)}
                  placeholder="Your transcription text will appear here for editing..."
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleContinueToStructured}>
                  <FileText className="mr-2 h-4 w-4" />
                  Continue to Structuring
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
