
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, List, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadForm } from '@/components/upload/UploadForm';
import { StorageInitializer } from '@/components/upload/StorageInitializer';
import { PermissionsManager } from '@/components/upload/PermissionsManager'; 
import { PatientDisplayHandler } from '@/components/upload/PatientDisplayHandler';
import { useAuth } from '@/hooks/useAuth';

export const UploadPageContent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Very simple retry function for the initialization
  const handleRetry = async () => {
    setError(null);
  };

  // Show the upload form when requested
  const handleShowUploadForm = () => {
    setShowUploadForm(true);
  };

  return (
    <div className="container mx-auto max-w-4xl flex flex-col justify-center pt-2">
      <PatientDisplayHandler />
      
      {/* Initialize storage in the background */}
      <StorageInitializer 
        userId={user?.id} 
        onError={setError} 
      />
      
      <PermissionsManager 
        error={error}
        setError={setError}
        onRetryInit={handleRetry}
      />

      {showUploadForm ? (
        <UploadForm />
      ) : (
        <div className="text-center py-6 space-y-6">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle className="text-center">How to get structured medical notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">You can try one of these options:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex flex-col items-center p-6 border rounded-md bg-[#F3F3F3]">
                    <ArrowUp className="h-10 w-10 text-[#33C3F0] mb-4" />
                    <h3 className="font-medium mb-2">Start a new transcription</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload a new audio file to transcribe</p>
                    <Button onClick={handleShowUploadForm} className="bg-[#33C3F0] hover:bg-[#1EAEDB]">
                      Upload Audio
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center p-6 border rounded-md bg-[#F3F3F3]">
                    <List className="h-10 w-10 text-[#33C3F0] mb-4" />
                    <h3 className="font-medium mb-2">View your transcriptions</h3>
                    <p className="text-sm text-muted-foreground mb-4">Access your previous transcriptions</p>
                    <Button onClick={() => navigate('/transcribe')} className="bg-white border border-[#33C3F0] text-[#33C3F0] hover:bg-[#F1F1F1]">
                      View Transcriptions
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 text-sm text-muted-foreground">
                <p>If you're experiencing persistent issues, please contact support for assistance.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
