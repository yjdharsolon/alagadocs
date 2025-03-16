
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';

export const usePatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  
  const searchParams = new URLSearchParams(location.search);
  const patientIdFromUrl = searchParams.get('id');

  useEffect(() => {
    const patientFromState = location.state?.patient;
    const patientFromStorage = sessionStorage.getItem('selectedPatient');
    
    if (patientFromState) {
      setPatient(patientFromState);
      sessionStorage.setItem('selectedPatient', JSON.stringify(patientFromState));
    } else if (patientFromStorage) {
      setPatient(JSON.parse(patientFromStorage));
    } else if (patientIdFromUrl) {
      const fetchPatientById = async () => {
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdFromUrl)
            .single();
            
          if (error) throw error;
          if (data) {
            setPatient(data);
            sessionStorage.setItem('selectedPatient', JSON.stringify(data));
          } else {
            toast.error('Patient not found');
            navigate('/select-patient');
          }
        } catch (error: any) {
          console.error('Error fetching patient:', error);
          toast.error('Failed to load patient data');
          navigate('/select-patient');
        }
      };
      
      fetchPatientById();
    } else {
      toast.error('No patient selected');
      navigate('/select-patient');
    }
  }, [location.state, navigate, patientIdFromUrl]);

  return {
    patient
  };
};
