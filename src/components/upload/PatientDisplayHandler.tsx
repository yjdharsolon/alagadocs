
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompactPatientHeader } from '@/components/patient/CompactPatientHeader';
import { Patient } from '@/types/patient';
import { toast } from 'sonner';

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

  if (!currentPatient) return null;

  return (
    <CompactPatientHeader
      firstName={currentPatient.first_name}
      lastName={currentPatient.last_name}
      dateOfBirth={currentPatient.date_of_birth}
      age={currentPatient.age}
      gender={currentPatient.gender}
      patientId={currentPatient.patient_id}
    />
  );
};
