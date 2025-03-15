
import { usePlaybackState } from './usePlaybackState';
import { useTimeSkip } from './useTimeSkip';
import { useAudioActions } from './useAudioActions';
import { useKeyboardControls } from './useKeyboardControls';
import { UseAudioControlsProps, UseAudioControlsResult } from './types';

export const useAudioControls = ({
  audioElement, 
  audioUrl, 
  audioDuration,
  setCurrentTime
}: UseAudioControlsProps): UseAudioControlsResult => {
  const { isPlaying, togglePlayPause } = usePlaybackState(audioElement);
  const { skipBackward, skipForward } = useTimeSkip(audioElement, audioDuration, setCurrentTime);
  const { downloadAudio, openDirectLink } = useAudioActions(audioUrl);
  
  // Setup keyboard controls
  useKeyboardControls(togglePlayPause, skipBackward, skipForward);

  return {
    isPlaying,
    togglePlayPause,
    skipBackward,
    skipForward,
    downloadAudio,
    openDirectLink
  };
};

export * from './types';
