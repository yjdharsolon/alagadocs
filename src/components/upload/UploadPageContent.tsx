
import React, { useState, useEffect } from 'react';
import { UploadForm } from '@/components/upload/UploadForm';
import { StoragePermissionAlert } from '@/components/upload/StoragePermissionAlert';
import { ResetPermissionsButton } from '@/components/upload/ResetPermissionsButton';
import { PatientDisplayCard } from '@/components/upload/PatientDisplayCard';
import { UploadPageHeader } from '@/components/upload/UploadPageHeader';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Patient } from '@/types/patient';

export const UploadPageContent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [fixingPermissions, setFixingPermissions] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
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
    <div className="container mx-auto py-6 px-4 pt-20">
      <UploadPageHeader 
        title="Upload Audio" 
        description="Upload audio or record your voice"
      />
      
      {currentPatient && (
        <PatientDisplayCard 
          patient={currentPatient} 
          onChangePatient={changePatient} 
        />
      )}
      
      <StoragePermissionAlert 
        error={error}
        onRetry={handleRetry}
        onFixPermissions={fixPermissions}
        retrying={retrying}
        fixingPermissions={fixingPermissions}
      />
      
      <UploadForm />
      
      {!error && (
        <ResetPermissionsButton 
          onClick={fixPermissions} 
          isLoading={fixingPermissions} 
        />
      )}
    </div>
  );
};
