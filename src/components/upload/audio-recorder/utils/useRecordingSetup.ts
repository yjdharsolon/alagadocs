
import { toast } from 'sonner';

interface RecordingSetupParams {
  streamRef: React.MutableRefObject<MediaStream | null>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
  setAudioPreview: (url: string | null) => void;
  setIsRecording: (isRecording: boolean) => void;
  setRecordingTime: (time: number) => void;
  onRecordingComplete: (file: File) => void;
  setShowNameDialog: (show: boolean) => void;
  setTempBlob: (blob: Blob | null) => void;
  setDefaultFileName: (name: string) => void;
}

export const useRecordingSetup = () => {
  const setupRecorder = async ({
    streamRef,
    mediaRecorderRef,
    audioChunksRef,
    setAudioPreview,
    setIsRecording,
    setRecordingTime,
    onRecordingComplete,
    setShowNameDialog,
    setTempBlob,
    setDefaultFileName
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
        
        // Set default file name based on current date/time
        const defaultFileName = `recording-${Date.now()}`;
        setDefaultFileName(defaultFileName);
        
        // Create an audio preview URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);
        
        // Store the blob temporarily and show the naming dialog
        setTempBlob(audioBlob);
        setShowNameDialog(true);
        
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

  const completeRecordingWithName = (
    blob: Blob,
    fileName: string,
    mimeType: string,
    onRecordingComplete: (file: File) => void
  ) => {
    const fileExtension = mimeType.split('/')[1];
    // Create file with custom name
    const audioFile = new File(
      [blob], 
      `${fileName}.${fileExtension}`, 
      { type: mimeType }
    );
    
    onRecordingComplete(audioFile);
    toast.success('Recording saved with name: ' + fileName);
  };

  return {
    setupRecorder,
    completeRecordingWithName
  };
};
