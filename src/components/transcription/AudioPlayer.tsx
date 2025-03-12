import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addCacheBuster } from '@/utils/urlUtils';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const loadAudio = useCallback((url: string) => {
    if (!url) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log(`Loading audio from URL: ${url}`);
    const audio = new Audio(url);
    setAudioElement(audio);
    
    audio.addEventListener('loadedmetadata', () => {
      if (isFinite(audio.duration)) {
        setAudioDuration(Math.floor(audio.duration));
        console.log(`Audio duration: ${audio.duration}`);
      } else {
        setAudioDuration(0);
        console.log('Audio duration is not a finite number');
      }
      setIsLoading(false);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(Math.floor(audio.currentTime));
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    });
    
    audio.addEventListener('error', (e) => {
      const errorCode = audio.error?.code || 0;
      const errorMessage = audio.error?.message || 'Unknown error';
      console.error(`Error loading audio file: ${errorMessage} (code: ${errorCode})`, e);
      setIsLoading(false);
      
      if (errorCode === 2) {
        setError(`Network error loading audio. Please check your connection.`);
      } else if (errorCode === 3) {
        setError(`Decoding error. Audio format may not be supported.`);
      } else if (errorCode === 4) {
        setError(`Cannot load audio (${errorMessage}). This may be due to permissions.`);
      } else {
        setError(`Cannot load audio (${errorMessage})`);
      }
      
      toast.error('Error loading audio file');
    });
    
    return audio;
  }, []);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    if (audioUrl) {
      const urlWithCacheBuster = addCacheBuster(audioUrl);
      audio = loadAudio(urlWithCacheBuster);
    } else {
      setIsLoading(false);
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audioUrl, loadAudio, retryCount]);
  
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
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'transcription_audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Audio download started');
  }, [audioUrl]);

  const retryLoadingAudio = useCallback(() => {
    setRetryCount(prev => prev + 1);
    toast("Retrying audio load...");
  }, []);

  const fixStoragePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('Fixing storage permissions...');
      
      const { data, error } = await supabase.functions.invoke('fix-storage-permissions');
      
      if (error) {
        console.error('Error fixing storage permissions:', error);
        setError('Failed to fix permissions. Please try again.');
        toast.error('Failed to fix permissions');
      } else {
        console.log('Storage permissions fixed:', data);
        toast.success('Storage permissions fixed! Retrying audio...');
        setRetryCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error fixing permissions:', err);
      setError('Error fixing permissions. Please try again.');
      toast.error('Failed to fix permissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        togglePlayPause();
      }
      
      if (e.code === 'ArrowLeft' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        skipBackward();
      }
      
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
    if (!isFinite(seconds) || isNaN(seconds)) {
      return '00:00';
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                <p className="text-sm text-red-800 mb-2">{error}</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={retryLoadingAudio}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" /> Retry Loading
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fixStoragePermissions}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Fix Permissions
                  </Button>
                </div>
              </div>
            )}
            
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
              {isLoading ? "Loading..." : `${formatTime(currentTime)} / ${formatTime(audioDuration)}`}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0}%` }}
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
