
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';

export const usePatientNavigation = (patient: Patient | null, searchQuery?: string, searchResults?: Patient[]) => {
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
    // Navigate back with search context if available
    navigate('/select-patient', {
      state: {
        searchQuery,
        searchResults
      }
    });
  };

  return {
    handleStartConsultation,
    handleEditPatient,
    handleBack
  };
};
