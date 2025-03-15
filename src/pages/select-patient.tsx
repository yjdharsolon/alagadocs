
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { PatientPageHeader } from '@/components/patient/PatientPageHeader';
import { PatientSearchForm } from '@/components/patient/PatientSearchForm';
import { PatientSearchResults } from '@/components/patient/PatientSearchResults';
import { NewPatientCard } from '@/components/patient/NewPatientCard';
import { Patient } from '@/types/patient';

export default function SelectPatientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearchResults = (results: Patient[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleSelectPatient = (patient: Patient) => {
    // Store selected patient in session storage for use in next screens
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    toast.success(`Selected patient: ${patient.first_name} ${patient.last_name}`);
    
    // Navigate to upload as next step in workflow
    navigate('/upload');
  };
  
  const handleCreatePatient = () => {
    // Navigate to the patient registration page
    navigate('/register-patient');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <PatientPageHeader title="Select Patient" />
        
        <PatientSearchForm 
          onSearchResults={handleSearchResults} 
          userId={user?.id}
        />
        
        <PatientSearchResults 
          searchResults={searchResults}
          hasSearched={hasSearched}
          onSelectPatient={handleSelectPatient}
        />
        
        <NewPatientCard onCreatePatient={handleCreatePatient} />
      </div>
    </Layout>
  );
}
