
import React from 'react';
import { MedicalSections } from '../types';
import { Button } from '@/components/ui/button';
import PatientInfoCard from './PatientInfoCard';
import MedicationsSection from './MedicationsSection';
import PrescriberInfoCard from './PrescriberInfoCard';
import { usePrescriptionEditor } from './components/usePrescriptionEditor';

interface PrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections) => void;
}

const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  structuredData,
  onSave,
}) => {
  const {
    patientInfo,
    medications,
    prescriberInfo,
    handlePatientInfoChange,
    handleMedicationChange,
    handleAddMedication,
    handleRemoveMedication,
    handlePrescriberInfoChange,
    handleSave
  } = usePrescriptionEditor({ structuredData, onSave });

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
