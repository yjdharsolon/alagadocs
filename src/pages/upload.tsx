
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AudioUploadPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    const initializeStorageBucket = async () => {
      try {
        setIsLoading(true);
        // Call the function to ensure storage bucket exists
        const { error: bucketError } = await supabase.functions.invoke('ensure-transcription-bucket');
        
        if (bucketError) {
          console.error('Error initializing storage bucket:', bucketError);
          setError('Error initializing storage. Uploads may not work properly.');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing storage bucket:', err);
        setError('Error initializing storage. Uploads may not work properly.');
        setIsLoading(false);
      }
    };

    initializeStorageBucket();
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Upload Audio</h1>
        <p className="text-muted-foreground mb-6">
          Upload an audio file or record your voice to transcribe
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <UploadForm />
        )}
      </div>
    </Layout>
  );
}
