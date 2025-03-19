
import React, { useState } from 'react';
import { MedicalSections } from '../types';
import { Button } from '@/components/ui/button';
import PatientInfoCard from './PatientInfoCard';
import MedicationsSection from './MedicationsSection';
import PrescriberInfoCard from './PrescriberInfoCard';

interface PrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections) => void;
}

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

const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  structuredData,
  onSave,
}) => {
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
  
  const [prescriberInfo, setPrescriberInfo] = useState(structuredData.prescriberInformation || {
    name: '',
    licenseNumber: '',
    signature: ''
  });

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

  return (
    <div className="prescription-editor space-y-6">
      <PatientInfoCard
        patientInfo={patientInfo}
        onChange={handlePatientInfoChange}
      />
      
      <MedicationsSection
        medications={medications}
        onMedicationChange={handleMedicationChange}
        onAddMedication={handleAddMedication}
        onRemoveMedication={handleRemoveMedication}
      />
      
      <PrescriberInfoCard
        prescriberInfo={prescriberInfo}
        onChange={handlePrescriberInfoChange}
      />
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#33C3F0] hover:bg-[#33C3F0]/90">
          Save Prescription
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionEditor;
