
import React from 'react';
import Layout from '@/components/Layout';
import { PatientForm } from '@/components/patient/PatientForm';
import { PatientPageHeader } from '@/components/patient/PatientPageHeader';
import { useNavigate } from 'react-router-dom';

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate('/select-patient');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <PatientPageHeader title="Register New Patient" />
        <PatientForm onCancel={handleCancel} />
      </div>
    </Layout>
  );
}
