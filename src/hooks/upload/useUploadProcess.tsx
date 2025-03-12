
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { uploadAudio, transcribeAudio } from '@/services/audio';
import { supabase } from '@/integrations/supabase/client';

export const useUploadProcess = (setError: (error: string | null) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'transcribing' | 'verifying'>('idle');
  const navigate = useNavigate();

  const handleSubmit = async (file: File | null, user: any) => {
    if (!file) {
      toast.error('Please upload or record an audio file first');
      return null;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to upload audio');
      navigate('/login');
      return null;
    }

    try {
      setIsUploading(true);
      setCurrentStep('verifying');
      setUploadProgress(5);
      setError(null);
      
      const isSimulation = file.name.includes('simulation-recording');
      
      // Get session but don't force a refresh
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('Authentication error. Please log in again.');
      }
      
      // Only refresh if the token is about to expire
      const expiresAt = sessionData.session.expires_at;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = expiresAt - currentTime;
      
      // Refresh only if less than 10 minutes left
      if (timeToExpire < 600) {
        console.log('Token about to expire, refreshing before upload');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error('Authentication error. Please refresh your session.');
        }
      }
      
      setCurrentStep('uploading');
      setUploadProgress(10);
      
      // More gradual progress updates for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 75) return prev + 1;
          return prev;
        });
      }, 100);
      
      console.log('Starting audio upload process with file:', file.name);
      
      // For simulation, move a bit faster
      if (isSimulation) {
        setUploadProgress(30);
      }
      
      // Upload the audio file to Supabase storage
      const audioUrl = await uploadAudio(file);
      
      console.log('Audio successfully uploaded:', audioUrl);
      
      clearInterval(progressInterval);
      setUploadProgress(80);
      setCurrentStep('transcribing');
      
      // Transcribe the audio
      const transcriptionData = await transcribeAudio(audioUrl);
      
      console.log('Transcription completed successfully');
      setUploadProgress(100);
      
      toast.success('Transcription completed successfully');
      
      // For the unified flow, return the data including duration
      const transcriptionId = Date.now().toString(); // Temporary ID for demo
      
      return {
        transcriptionData,
        audioUrl,
        transcriptionId,
        duration: transcriptionData.duration || null // Include duration in the returned data
      };
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication error')) {
        setError('Authentication error. Please log in again.');
        toast.error('Authentication error. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return null;
      }
      
      // Handle RLS policy errors
      if (error instanceof Error && 
         (error.message.includes('row-level security policy') || 
          error.message.includes('Permission error'))) {
        setError('Permission error. Please try logging out and logging back in.');
        toast.error('Permission error detected. This is often fixed by logging out and back in again.');
        return null;
      }
      
      setError(error instanceof Error ? error.message : 'Error uploading audio. Please try again.');
      toast.error('Error uploading audio. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
      setCurrentStep('idle');
    }
  };
  
  const getStepLabel = () => {
    switch (currentStep) {
      case 'verifying': return 'Verifying Authentication...';
      case 'uploading': return 'Uploading Audio...';
      case 'transcribing': return 'Transcribing Audio...';
      default: return 'Continue to Transcription';
    }
  };

  return {
    isUploading,
    uploadProgress,
    currentStep,
    handleSubmit,
    getStepLabel
  };
};
