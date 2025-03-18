
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePatientInfo = () => {
  const location = useLocation();
  
  const transcriptionData = location.state?.transcriptionData;
  const statePatientId = location.state?.patientId;
  const statePatientName = location.state?.patientName;
  const transcriptionPatientId = transcriptionData?.patient_id;
  
  const [patientInfo, setPatientInfo] = useState<{id: string | null, name: string | null}>({
    id: null,
    name: null
  });

  // Initialize patient info from various sources
  useEffect(() => {
    if (statePatientId) {
      setPatientInfo({
        id: statePatientId,
        name: statePatientName || null
      });
      return;
    }
    
    if (transcriptionPatientId) {
      setPatientInfo({
        id: transcriptionPatientId,
        name: null
      });
      return;
    }
    
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patientData = JSON.parse(storedPatient);
        setPatientInfo({
          id: patientData.id,
          name: `${patientData.first_name} ${patientData.last_name}`
        });
      }
    } catch (error) {
      console.error('Error retrieving patient from sessionStorage:', error);
    }
  }, [statePatientId, statePatientName, transcriptionPatientId]);

  return { patientInfo };
};
