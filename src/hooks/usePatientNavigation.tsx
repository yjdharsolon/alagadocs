
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';

export const usePatientNavigation = (patient: Patient | null) => {
  const navigate = useNavigate();

  const handleStartConsultation = () => {
    // Store patient in session storage to ensure it's available on the upload page
    if (patient) {
      sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    }
    
    navigate('/upload', { 
      state: { 
        patient: patient 
      } 
    });
  };

  const handleEditPatient = () => {
    navigate(`/edit-patient?id=${patient?.id}`);
  };

  const handleBack = () => {
    navigate('/select-patient');
  };

  return {
    handleStartConsultation,
    handleEditPatient,
    handleBack
  };
};
