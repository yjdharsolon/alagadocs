
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
import { toast } from 'sonner';

export const usePrescriptionEditor = ({
  structuredData,
  onSave
}: UsePrescriptionEditorProps): PrescriptionEditorState => {
  const { user } = useAuth();
  const { profileData } = useProfileFields();
  const [stayInEditMode, setStayInEditMode] = useState(true);

  // Extract only prescription-relevant data
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(structuredData.patientInformation || {
    name: '',
    sex: '',
    age: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Initialize medications with improved error handling
  const [medications, setMedications] = useState<Medication[]>(() => {
    const initialMedications = initializeMedications(structuredData.medications);
    console.log('Initial medications state:', JSON.stringify(initialMedications, null, 2));
    return initialMedications;
  });
  
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
  
  // Hook up medication utility functions to state with improved logging
  const handleMedicationChangeState = (index: number, field: keyof Medication, value: string) => {
    console.log(`Medication change requested - Index: ${index}, Field: ${field}, Value: ${value}`);
    console.log('Current medications before change:', JSON.stringify(medications, null, 2));
    
    const updatedMedications = handleMedicationChange(medications, index, field, value);
    console.log('Setting medications state with:', JSON.stringify(updatedMedications, null, 2));
    
    setMedications(updatedMedications);
  };
  
  const handleAddMedication = () => {
    console.log('Adding new medication');
    const updatedMedications = addMedication(medications);
    console.log('Setting medications state after add:', JSON.stringify(updatedMedications, null, 2));
    setMedications(updatedMedications);
  };
  
  const handleRemoveMedication = (index: number) => {
    console.log(`Removing medication at index ${index}`);
    const updatedMedications = removeMedication(medications, index);
    console.log('Setting medications state after remove:', JSON.stringify(updatedMedications, null, 2));
    setMedications(updatedMedications);
  };
  
  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Toggle whether to stay in edit mode after saving
  const toggleStayInEditMode = () => {
    setStayInEditMode(prev => !prev);
    toast.info(stayInEditMode ? "Will exit editor after saving" : "Will stay in editor after saving");
  };
  
  // Handle form submission with validation using our utility
  const handleSave = (forceStayInEditMode?: boolean) => {
    console.log('handleSave called with forceStayInEditMode:', forceStayInEditMode);
    console.log('Current medications being saved:', JSON.stringify(medications, null, 2));
    
    // Use forceStayInEditMode if provided, otherwise use the stayInEditMode state
    const shouldStayInEditMode = forceStayInEditMode !== undefined ? forceStayInEditMode : stayInEditMode;
    console.log('shouldStayInEditMode calculated as:', shouldStayInEditMode);
    
    validateAndSavePrescription(
      structuredData,
      patientInfo,
      medications,
      prescriberInfo,
      onSave,
      shouldStayInEditMode
    );
  };

  return {
    patientInfo,
    medications,
    prescriberInfo,
    stayInEditMode,
    handlePatientInfoChange,
    handleMedicationChange: handleMedicationChangeState,
    handleAddMedication,
    handleRemoveMedication,
    handlePrescriberInfoChange,
    toggleStayInEditMode,
    handleSave
  };
};

export type { Medication };
