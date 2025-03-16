
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
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
      <div className="container mx-auto px-4 pt-4">
        <UploadPageContent key={patient?.id || 'no-patient'} />
      </div>
    </Layout>
  );
}
