
import { useState, useEffect } from 'react';
import { MedicalSections } from '../../types';
import { useProfileFields } from '@/hooks/useProfileFields';
import { useAuth } from '@/hooks/useAuth';

interface Medication {
  id?: number;
  name: string;
  strength: string;
  dosageForm: string;
  sigInstructions: string;
  quantity: string;
  refills: string;
  specialInstructions: string;
}

interface UsePrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections) => void;
}

export interface PrescriptionEditorState {
  patientInfo: any;
  medications: Medication[];
  prescriberInfo: any;
  handlePatientInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMedicationChange: (index: number, field: keyof Medication, value: string) => void;
  handleAddMedication: () => void;
  handleRemoveMedication: (index: number) => void;
  handlePrescriberInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

export const usePrescriptionEditor = ({
  structuredData,
  onSave
}: UsePrescriptionEditorProps): PrescriptionEditorState => {
  const { user } = useAuth();
  const { profileData } = useProfileFields();

  // Extract only prescription-relevant data
  const [patientInfo, setPatientInfo] = useState(structuredData.patientInformation || {
    name: '',
    sex: '',
    age: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [medications, setMedications] = useState<Medication[]>(
    Array.isArray(structuredData.medications) 
      ? structuredData.medications.map((med, index) => ({
          id: med.id || index + 1,
          name: med.name || '',
          strength: med.strength || '',
          dosageForm: med.dosageForm || '',
          sigInstructions: med.sigInstructions || '',
          quantity: med.quantity || '',
          refills: med.refills || '',
          specialInstructions: med.specialInstructions || ''
        }))
      : []
  );
  
  // Initialize prescriberInfo with correct structure - removed signature field
  const [prescriberInfo, setPrescriberInfo] = useState({
    name: '',
    licenseNumber: '',
    s2Number: '',
    ptrNumber: '',
    title: ''
  });

  // Update prescriberInfo when profileData changes - fixed mapping
  useEffect(() => {
    if (profileData) {
      const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
      
      setPrescriberInfo(prev => ({
        ...prev,
        name: fullName || prev.name || '',
        licenseNumber: profileData.prc_license || prev.licenseNumber || '',
        s2Number: profileData.s2_number || prev.s2Number || '',
        ptrNumber: profileData.ptr_number || prev.ptrNumber || '',
        title: profileData.medical_title || prev.title || ''
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
  
  // Handle medication changes
  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setMedications(updatedMedications);
  };
  
  // Add a new medication
  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        id: medications.length + 1,
        name: '',
        strength: '',
        dosageForm: '',
        sigInstructions: '',
        quantity: '',
        refills: '',
        specialInstructions: ''
      }
    ]);
  };
  
  // Remove a medication
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    
    // Update IDs to maintain sequential numbering
    const reindexedMedications = updatedMedications.map((med, idx) => ({
      ...med,
      id: idx + 1
    }));
    
    setMedications(reindexedMedications);
  };
  
  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission
  const handleSave = () => {
    const updatedData: MedicalSections = {
      ...structuredData,
      patientInformation: patientInfo,
      medications: medications,
      prescriberInformation: prescriberInfo
    };
    
    onSave(updatedData);
  };

  return {
    patientInfo,
    medications,
    prescriberInfo,
    handlePatientInfoChange,
    handleMedicationChange,
    handleAddMedication,
    handleRemoveMedication,
    handlePrescriberInfoChange,
    handleSave
  };
};

export type { Medication };
