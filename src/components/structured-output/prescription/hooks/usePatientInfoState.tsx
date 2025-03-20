
import { useState, useEffect } from 'react';
import { PatientInfo } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';

/**
 * Hook for managing patient information in the prescription editor
 */
export const usePatientInfoState = (structuredData: MedicalSections) => {
  // Initialize patient info from structuredData or with defaults
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(
    structuredData.patientInformation || {
      name: '',
      sex: '',
      age: '',
      date: new Date().toISOString().split('T')[0]
    }
  );

  // Update patient info when structuredData changes
  useEffect(() => {
    if (structuredData.patientInformation) {
      setPatientInfo(prev => ({
        ...prev,
        ...(structuredData.patientInformation || {})
      }));
    }
  }, [structuredData.patientInformation]);

  // Handle patient info changes
  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  return {
    patientInfo,
    setPatientInfo,
    handlePatientInfoChange
  };
};
