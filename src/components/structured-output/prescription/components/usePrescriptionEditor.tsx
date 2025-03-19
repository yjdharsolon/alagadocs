
import { useState, useEffect } from 'react';
import { MedicalSections } from '../../types';
import { useProfileFields } from '@/hooks/useProfileFields';
import { useAuth } from '@/hooks/useAuth';
import { 
  Medication, 
  PrescriptionEditorState, 
  UsePrescriptionEditorProps,
  PatientInfo,
  PrescriberInfo
} from '../types/prescriptionTypes';
import { 
  handleMedicationChange, 
  addMedication, 
  removeMedication,
  initializeMedications
} from '../utils/medicationUtils';
import { validateAndSavePrescription } from '../utils/saveUtils';

export const usePrescriptionEditor = ({
  structuredData,
  onSave
}: UsePrescriptionEditorProps): PrescriptionEditorState => {
  const { user } = useAuth();
  const { profileData } = useProfileFields();

  // Extract only prescription-relevant data
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(structuredData.patientInformation || {
    name: '',
    sex: '',
    age: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Initialize medications with improved error handling
  const [medications, setMedications] = useState<Medication[]>(() => 
    initializeMedications(structuredData.medications)
  );
  
  // Initialize prescriberInfo with correct structure
  const [prescriberInfo, setPrescriberInfo] = useState<PrescriberInfo>({
    name: '',
    licenseNumber: '',
    s2Number: '',
    ptrNumber: ''
  });

  // Update prescriberInfo when profileData changes
  useEffect(() => {
    if (profileData) {
      // Format name with proper spacing
      const firstName = profileData.first_name || '';
      const middleName = profileData.middle_name ? `${profileData.middle_name.charAt(0)}. ` : '';
      const lastName = profileData.last_name || '';
      const nameExtension = profileData.name_extension ? `, ${profileData.name_extension}` : '';
      
      const fullName = `${firstName} ${middleName}${lastName}${nameExtension}`.trim();
      
      setPrescriberInfo(prev => ({
        ...prev,
        name: fullName || prev.name || '',
        licenseNumber: profileData.prc_license || prev.licenseNumber || '',
        s2Number: profileData.s2_number || prev.s2Number || '',
        ptrNumber: profileData.ptr_number || prev.ptrNumber || ''
      }));
    }
  }, [profileData]);

  // Effect to initialize with structured data if present
  useEffect(() => {
    if (structuredData.prescriberInformation) {
      setPrescriberInfo(prev => ({
        ...prev,
        ...(structuredData.prescriberInformation || {}),
      }));
    }
  }, [structuredData.prescriberInformation]);

  // Handle patient info changes
  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Hook up medication utility functions to state
  const handleMedicationChangeState = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = handleMedicationChange(medications, index, field, value);
    setMedications(updatedMedications);
  };
  
  const handleAddMedication = () => {
    const updatedMedications = addMedication(medications);
    setMedications(updatedMedications);
  };
  
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = removeMedication(medications, index);
    setMedications(updatedMedications);
  };
  
  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission with validation using our utility
  const handleSave = () => {
    validateAndSavePrescription(
      structuredData,
      patientInfo,
      medications,
      prescriberInfo,
      onSave
    );
  };

  return {
    patientInfo,
    medications,
    prescriberInfo,
    handlePatientInfoChange,
    handleMedicationChange: handleMedicationChangeState,
    handleAddMedication,
    handleRemoveMedication,
    handlePrescriberInfoChange,
    handleSave
  };
};

export type { Medication };
