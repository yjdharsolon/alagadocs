
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';
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
  
  const togglePlayPause = useCallback(() => {
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
  }, [audioElement, isPlaying]);
  
  const skipBackward = useCallback(() => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  }, [audioElement]);
  
  const skipForward = useCallback(() => {
    if (!audioElement) return;
    audioElement.currentTime = Math.min(audioDuration, audioElement.currentTime + 10);
    setCurrentTime(Math.floor(audioElement.currentTime));
  }, [audioElement, audioDuration]);
  
  const downloadAudio = useCallback(() => {
    if (!audioUrl) {
      toast.error('No audio available for download');
      return;
    }
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'transcription_audio.mp3'; // Default name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Audio download started');
  }, [audioUrl]);

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar toggles play/pause
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault(); // Prevent scrolling with space
        togglePlayPause();
      }
      
      // Left arrow skips backward
      if (e.code === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipBackward();
      }
      
      // Right arrow skips forward
      if (e.code === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipForward();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause, skipBackward, skipForward]);
  
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
              <Button variant="outline" size="icon" onClick={skipBackward} title="Skip backward 10s (Left arrow)">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause} title="Play/Pause (Space)">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={skipForward} title="Skip forward 10s (Right arrow)">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={downloadAudio} title="Download audio">
                <Download className="h-4 w-4" />
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
            <div className="text-xs text-muted-foreground text-center">
              Keyboard shortcuts: Space (play/pause), ← (backward), → (forward)
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
