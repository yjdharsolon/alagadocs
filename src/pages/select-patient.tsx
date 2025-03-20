
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Load search state from location if available
  useEffect(() => {
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
      setHasSearched(true);
    }
    
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);
  
  const handleSearchResults = (results: Patient[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
    setHasSearched(true);
  };
  
  const handleSelectPatient = (patient: Patient) => {
    // Store selected patient in session storage for use in next screens
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    toast.success(`Selected patient: ${patient.first_name} ${patient.last_name}`);
    
    // Navigate to patient details page with search context
    navigate('/patient-details', { 
      state: { 
        patient,
        searchQuery,
        searchResults
      } 
    });
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
          initialSearchQuery={searchQuery}
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
