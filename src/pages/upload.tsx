
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  patient_id?: string;
};

export default function AudioUploadPage() {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [fixingPermissions, setFixingPermissions] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

    // Check if patient is selected
    const selectedPatientJson = sessionStorage.getItem('selectedPatient');
    if (!selectedPatientJson) {
      toast.error('No patient selected. Please select a patient first.');
      navigate('/select-patient');
      return;
    }

    try {
      const patientData = JSON.parse(selectedPatientJson);
      setCurrentPatient(patientData);
    } catch (error) {
      console.error('Error parsing patient data:', error);
      toast.error('Error retrieving patient information');
      navigate('/select-patient');
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

  const changePatient = () => {
    navigate('/select-patient');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 pt-20">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>Upload Audio</h1>
        
        {currentPatient && (
          <Card className="mb-4 bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      Current Patient: {currentPatient.first_name} {currentPatient.last_name}
                    </p>
                    {currentPatient.patient_id && (
                      <p className="text-xs text-muted-foreground">ID: {currentPatient.patient_id}</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={changePatient}>
                  Change Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <p className="text-muted-foreground mb-4 text-sm">
          Upload audio or record your voice
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
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
          <div className="mt-2 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={fixPermissions}
              disabled={fixingPermissions}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${fixingPermissions ? 'animate-spin' : ''}`} />
              {fixingPermissions ? 'Fixing...' : 'Reset Permissions'}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};
