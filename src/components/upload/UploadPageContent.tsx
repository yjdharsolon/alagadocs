
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadForm } from '@/components/upload/UploadForm';
import { StorageInitializer } from '@/components/upload/StorageInitializer';
import { PermissionsManager } from '@/components/upload/PermissionsManager'; 
import { PatientDisplayHandler } from '@/components/upload/PatientDisplayHandler';
import { useAuth } from '@/hooks/useAuth';

export const UploadPageContent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
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

  return (
    <div className="container mx-auto max-w-4xl flex flex-col justify-center min-h-[calc(100vh-10rem)]">
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
      
      <UploadForm />
    </div>
  );
};
