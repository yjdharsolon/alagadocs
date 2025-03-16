import React, { useState, useEffect } from 'react';
import { RecordingControls } from './RecordingControls';
import { AudioPreview } from './AudioPreview';
import { useAudioRecording } from './useAudioRecording';
import { Progress } from '@/components/ui/progress';
import { RecordingNameDialog } from './RecordingNameDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mic } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete,
  isRecording: externalIsRecording,
  setIsRecording: externalSetIsRecording
}) => {
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const isMobile = useIsMobile();
  
  const isRecording = externalIsRecording !== undefined ? externalIsRecording : internalIsRecording;
  const setIsRecording = externalSetIsRecording || setInternalIsRecording;

  const { 
    startRecording, 
    stopRecording, 
    resetRecording,
    audioPreview,
    recordingTime,
    maxRecordingTime,
    formatTime,
    audioPreviewRef,
    togglePlayPreview,
    showNameDialog,
    setShowNameDialog,
    saveRecordingWithName,
    closeNameDialog,
    defaultFileName
  } = useAudioRecording({
    onRecordingComplete,
    isRecording,
    setIsRecording,
    setIsPlayingPreview
  });

  useEffect(() => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.onended = () => {
        setIsPlayingPreview(false);
      };
    }
  }, [audioPreview, audioPreviewRef]);

  return (
    <div className="space-y-2">
      {audioPreview && (
        <AudioPreview 
          audioPreviewRef={audioPreviewRef}
          audioPreview={audioPreview}
          isPlayingPreview={isPlayingPreview}
          togglePlayPreview={togglePlayPreview}
          resetRecording={resetRecording}
          recordingTime={recordingTime}
          formatTime={formatTime}
        />
      )}
      
      {isRecording ? (
        <div className="space-y-2">
          <div className="animate-pulse flex items-center justify-center p-2">
            <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full bg-red-500 flex items-center justify-center`}>
              <Mic className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{formatTime(recordingTime)}</span>
              <span>{formatTime(maxRecordingTime)}</span>
            </div>
            <Progress value={(recordingTime / maxRecordingTime) * 100} className="h-2 bg-[#E0E0E0]">
              <div className="h-full bg-[#33C3F0] rounded-full" />
            </Progress>
          </div>
          <RecordingControls 
            isRecording={isRecording} 
            startRecording={startRecording} 
            stopRecording={stopRecording}
            isPlayingPreview={isPlayingPreview}
          />
        </div>
      ) : (
        <RecordingControls 
          isRecording={isRecording} 
          startRecording={startRecording} 
          stopRecording={stopRecording}
          isPlayingPreview={isPlayingPreview}
        />
      )}

      <RecordingNameDialog
        isOpen={showNameDialog}
        onClose={closeNameDialog}
        onSave={saveRecordingWithName}
        defaultName={defaultFileName}
      />
    </div>
  );
};
