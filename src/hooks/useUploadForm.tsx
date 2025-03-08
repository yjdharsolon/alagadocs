
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { uploadAudio, transcribeAudio } from '@/services/audio';
import { supabase } from '@/integrations/supabase/client';

export const useUploadForm = (user: any, signOut: () => Promise<void>) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'idle' | 'uploading' | 'transcribing' | 'verifying'>('idle');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Verify authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        toast.error('Please log in to upload audio');
        navigate('/login');
        return;
      }
      
      // Verify user session is valid
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        
        // Refresh the session token
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing token:', refreshError);
          toast.error('Authentication error. Please log in again.');
          handleLogoutAndLogin();
          return;
        }
        
        console.log('Auth session verified and refreshed successfully');
      } catch (err) {
        console.error('Error checking auth session:', err);
      }
    };
    
    checkAuth();
  }, [user, navigate]);
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };
  
  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setIsRecording(false);
    setError(null);
    toast.success('Recording saved successfully');
  };
  
  const handleLogoutAndLogin = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully. Please log in again to continue.');
    } catch (err) {
      console.error('Error during logout:', err);
      // Force navigate to login even if signOut fails
      navigate('/login');
    }
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload or record an audio file first');
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to upload audio');
      navigate('/login');
      return;
    }

    try {
      setIsUploading(true);
      setCurrentStep('verifying');
      setUploadProgress(5);
      setError(null);
      
      // Verify session before proceeding
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('Authentication error. Please log in again.');
      }
      
      // Refresh token before proceeding
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        throw new Error('Authentication error. Please refresh your session.');
      }
      
      setCurrentStep('uploading');
      setUploadProgress(10);
      
      // More gradual progress updates for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 75) return prev + 2;
          return prev;
        });
      }, 300);
      
      console.log('Starting audio upload process with file:', file.name);
      
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
      
      // After successful transcription, navigate to the transcribe page with the data
      toast.success('Transcription completed successfully');
      
      // Navigate to transcribe page with the transcription data
      navigate('/transcribe', { 
        state: { 
          transcriptionData,
          audioUrl,
          transcriptionId: Date.now().toString() // Temporary ID for demo
        } 
      });
      
    } catch (error) {
      console.error('Error uploading audio:', error);
      
      // Handle authentication errors specifically
      if (error instanceof Error && error.message.includes('Authentication error')) {
        setError('Authentication error. Please log in again.');
        toast.error('Authentication error. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      }
      
      // Handle RLS policy errors
      if (error instanceof Error && 
         (error.message.includes('row-level security policy') || 
          error.message.includes('Permission error'))) {
        setError('Permission error. Please try logging out and logging back in.');
        toast.error('Permission error detected. This is often fixed by logging out and back in again.');
        return;
      }
      
      setError(error instanceof Error ? error.message : 'Error uploading audio. Please try again.');
      toast.error('Error uploading audio. Please try again.');
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
    file,
    isUploading,
    isRecording,
    setIsRecording,
    uploadProgress,
    currentStep,
    error,
    handleFileSelect,
    handleRecordingComplete,
    handleLogoutAndLogin,
    handleSubmit,
    getStepLabel
  };
};
