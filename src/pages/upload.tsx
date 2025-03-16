
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { UploadPageContent } from '@/components/upload/UploadPageContent';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function UploadPage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-4">
        {patient && (
          <div className="flex justify-start mb-4">
            <Button 
              variant="ghost" 
              onClick={handleGoBack} 
              className="text-[#33C3F0] hover:text-[#1EAEDB] hover:bg-transparent"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
        <UploadPageContent key={patient?.id || 'no-patient'} />
      </div>
    </Layout>
  );
}
