
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import toast from 'react-hot-toast';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
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
  }, [audioUrl]);
  
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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Player</CardTitle>
        <CardDescription>
          Listen while you edit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {audioUrl ? (
          <>
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
          </>
        ) : (
          <div className="flex justify-center items-center h-24">
            <p className="text-muted-foreground text-center">No audio available for this transcription</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
