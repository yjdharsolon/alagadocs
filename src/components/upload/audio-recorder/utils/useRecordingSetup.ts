
import { toast } from 'sonner';

interface RecordingSetupParams {
  streamRef: React.MutableRefObject<MediaStream | null>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
  setAudioPreview: (url: string | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setRecordingTime: (time: number) => void;
  onRecordingComplete: (file: File) => void;
}

export const useRecordingSetup = () => {
  const setupRecorder = async ({
    streamRef,
    mediaRecorderRef,
    audioChunksRef,
    setAudioPreview,
    setIsRecording,
    setRecordingTime,
    onRecordingComplete
  }: RecordingSetupParams) => {
    try {
      // Clear previous recording if exists
      if (setAudioPreview) {
        setAudioPreview(null);
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Try different mime types for better compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: `${mimeType}`
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const fileExtension = mimeType.split('/')[1];
        const audioFile = new File(
          [audioBlob], 
          `recording-${Date.now()}.${fileExtension}`, 
          { type: mimeType }
        );
        
        // Create an audio preview URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        
        onRecordingComplete(audioFile);
        
        // Stop all tracks in the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      // Start recording with a 100ms timeslice for better streaming
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
      
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
      return false;
    }
  };

  return {
    setupRecorder
  };
};
