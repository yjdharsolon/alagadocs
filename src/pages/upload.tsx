
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UploadPageHeader } from '@/components/upload/UploadPageHeader';
import { UploadPageContent } from '@/components/upload/UploadPageContent';
import { Patient } from '@/types/patient';

export default function UploadPage() {
  const location = useLocation();
  const patientFromState = location.state?.patient as Patient | undefined;
  
  useEffect(() => {
    // Store the patient from state into session storage if available
    if (patientFromState) {
      sessionStorage.setItem('selectedPatient', JSON.stringify(patientFromState));
    }
  }, [patientFromState]);

  // Get the patient data from session storage if not in state
  const patientFromStorage = sessionStorage.getItem('selectedPatient');
  const patient = patientFromState || (patientFromStorage ? JSON.parse(patientFromStorage) : null);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <UploadPageHeader title="Upload Audio" />
        {/* We pass patient as a key to force re-render when it changes, not as a prop */}
        <UploadPageContent key={patient?.id || 'no-patient'} />
      </div>
    </Layout>
  );
}
