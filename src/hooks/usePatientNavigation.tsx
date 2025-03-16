
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';

export const usePatientNavigation = (patient: Patient | null) => {
  const navigate = useNavigate();

  const handleStartConsultation = () => {
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
