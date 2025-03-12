
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useAudioLoader,
  useAudioControls,
  usePermissionFixer,
  AudioError,
  AudioControls,
  ProgressBar,
  KeyboardHelp,
  NoAudio
} from './audio-player';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const { retryCount, retryLoadingAudio, fixStoragePermissions, checkStoragePolicies } = usePermissionFixer();
  
  const { 
    audioElement, 
    isLoading, 
    error, 
    is403Error, 
    audioDuration, 
    currentTime, 
    setCurrentTime 
  } = useAudioLoader({ 
    audioUrl: audioUrl || null, 
    retryCount 
  });
  
  const { 
    isPlaying, 
    togglePlayPause, 
    skipBackward, 
    skipForward, 
    downloadAudio, 
    openDirectLink 
  } = useAudioControls({ 
    audioElement, 
    audioUrl: audioUrl || '', 
    audioDuration, 
    setCurrentTime 
  });

  // Verify we have a valid URL
  const hasValidUrl = audioUrl && audioUrl.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Player</CardTitle>
        <CardDescription>
          Listen while you edit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasValidUrl ? (
          <>
            <AudioError 
              error={error || ''} 
              isLoading={isLoading}
              is403Error={is403Error}
              retryLoadingAudio={retryLoadingAudio}
              fixStoragePermissions={fixStoragePermissions}
              checkStoragePolicies={checkStoragePolicies}
              openDirectLink={openDirectLink}
            />
            
            <AudioControls 
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              skipBackward={skipBackward}
              skipForward={skipForward}
              downloadAudio={downloadAudio}
              disabled={!audioElement || isLoading}
              hasError={!!error}
              is403Error={is403Error}
            />
            
            <ProgressBar 
              currentTime={currentTime}
              audioDuration={audioDuration}
              isLoading={isLoading}
            />
            
            <KeyboardHelp />
          </>
        ) : (
          <NoAudio />
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
