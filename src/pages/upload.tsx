
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function AudioUploadPage() {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [fixingPermissions, setFixingPermissions] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const initializeStorageBucket = async () => {
    try {
      setError(null);
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Get the current session without refreshing
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('No valid session:', sessionError);
        setError('Authentication error. Please log in again.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      
      // Call the function to ensure storage bucket exists but don't block UI
      supabase.functions.invoke('ensure-transcription-bucket')
        .then(({ error: bucketError }) => {
          if (bucketError) {
            console.error('Error initializing storage bucket:', bucketError);
            setError('Error initializing storage. Please try again or contact support.');
          }
        });
    } catch (err) {
      console.error('Error initializing storage bucket:', err);
      setError('Error initializing storage. Please try again or contact support.');
    }
  };
  
  const fixPermissions = async () => {
    try {
      setFixingPermissions(true);
      setError(null);
      
      // Call our edge function to fix storage permissions
      const { data, error } = await supabase.functions.invoke('fix-storage-permissions');
      
      if (error) {
        console.error('Error fixing storage permissions:', error);
        setError('Could not fix permissions. Please try again or contact support.');
        toast.error('Failed to fix permissions');
      } else {
        console.log('Fix permissions response:', data);
        toast.success('Storage permissions fixed! Please try uploading again.');
      }
    } catch (err) {
      console.error('Error fixing permissions:', err);
      setError('Error fixing permissions. Please try again.');
      toast.error('Failed to fix permissions');
    } finally {
      setFixingPermissions(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize storage in the background without showing a loading state
    initializeStorageBucket();
  }, [user, navigate]);

  const handleRetry = async () => {
    setRetrying(true);
    await initializeStorageBucket();
    setRetrying(false);
    toast.success('Storage initialization attempted again');
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Upload Audio</h1>
        <p className="text-muted-foreground mb-6">
          Upload an audio file or record your voice to transcribe
        </p>
        
        <Alert className="mb-6" variant="default">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Testing Mode: You can use the "Simulate Recording & Upload" button to test the upload process without using your microphone.
          </AlertDescription>
        </Alert>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  disabled={retrying}
                >
                  {retrying ? 'Retrying...' : 'Retry'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={fixPermissions}
                  disabled={fixingPermissions}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${fixingPermissions ? 'animate-spin' : ''}`} />
                  {fixingPermissions ? 'Fixing...' : 'Fix Permissions'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <UploadForm />
        
        {!error && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={fixPermissions}
              disabled={fixingPermissions}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${fixingPermissions ? 'animate-spin' : ''}`} />
              {fixingPermissions ? 'Fixing Permissions...' : 'Reset Storage Permissions'}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
