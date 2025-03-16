
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientDisplayCard } from './PatientDisplayCard';
import { Patient } from '@/types/patient';
import toast from 'react-hot-toast';

export const PatientDisplayHandler: React.FC = () => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
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
    }
  }, [navigate]);

  const changePatient = () => {
    navigate('/select-patient');
  };

  return currentPatient ? (
    <PatientDisplayCard 
      patient={currentPatient} 
      onChangePatient={changePatient} 
    />
  ) : null;
};
