
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, FileAudio, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

// Mocked transcription result for now
// In the actual implementation, this would come from the previous step
const mockTranscription = `
Patient presents with complaints of persistent headaches lasting for the past 3 weeks. The headaches are described as throbbing in nature, primarily located in the frontal and temporal regions. Pain is rated as 7 out of 10 on the pain scale. Patient reports that headaches are worse in the morning and are sometimes accompanied by nausea. No vomiting reported. Patient has tried over-the-counter pain medications with minimal relief. No history of migraines. Patient mentions increased stress at work recently. Vital signs are within normal limits. Neurological examination shows no abnormalities. Recommended an MRI to rule out any structural issues and prescribed sumatriptan 50mg for acute episodes. Follow-up in 2 weeks.
`;

export default function EditTranscriptPage() {
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState('edit');
  const navigate = useNavigate();

  // Simulate loading the transcription
  useEffect(() => {
    const timer = setTimeout(() => {
      setTranscriptionText(mockTranscription.trim());
      setIsLoading(false);
      setAudioDuration(120); // Mock 2 minutes of audio
    }, 1000);

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscriptionText(e.target.value);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
  };

  const skipForward = () => {
    setCurrentTime(prev => Math.min(audioDuration, prev + 10));
  };

  const handleSave = () => {
    toast.success('Transcription saved successfully');
  };

  const handleStructure = () => {
    toast.success('Changes saved');
    navigate('/structured-output');
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
            Edit the transcribed text while listening to the original audio
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Audio Player Column */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-5 w-5" />
                    Audio Player
                  </CardTitle>
                  <CardDescription>
                    Listen while editing
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
            </div>
            
            {/* Editor Column */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <TabsContent value="edit" className="m-0">
                    <Textarea 
                      value={transcriptionText}
                      onChange={handleTextChange}
                      className="min-h-[300px] font-mono"
                      placeholder="Loading transcription..."
                      disabled={isLoading}
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="m-0">
                    <div className="min-h-[300px] p-4 bg-slate-50 rounded-lg whitespace-pre-line">
                      {transcriptionText}
                    </div>
                  </TabsContent>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={handleStructure}
                    disabled={isLoading}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Save and Structure
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Only
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
