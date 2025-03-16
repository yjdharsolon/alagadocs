
import { useState, useEffect } from 'react';

interface PatientInfo {
  id: string | null;
  name: string | null;
}

export const usePatientContext = (locationPatientId?: string | null, locationPatientName?: string | null) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    id: locationPatientId || null,
    name: locationPatientName || null
  });
  
  // Try to get patient info from session storage if not in location state
  useEffect(() => {
    if (!locationPatientId) {
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
    }
  }, [locationPatientId]);
  
  return patientInfo;
};
