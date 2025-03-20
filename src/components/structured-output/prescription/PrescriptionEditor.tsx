
import React from 'react';
import { MedicalSections } from '../types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PatientInfoCard from './PatientInfoCard';
import MedicationsSection from './MedicationsSection';
import PrescriberInfoCard from './PrescriberInfoCard';
import { usePrescriptionEditor } from './components/usePrescriptionEditor';

interface PrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
  updateDataDirectly?: (data: MedicalSections) => void;
}

const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  structuredData,
  onSave,
  updateDataDirectly
}) => {
  const {
    patientInfo,
    medications,
    prescriberInfo,
    stayInEditMode,
    handlePatientInfoChange,
    handleMedicationChange,
    handleAddMedication,
    handleRemoveMedication,
    handlePrescriberInfoChange,
    toggleStayInEditMode,
    handleSave
  } = usePrescriptionEditor({ 
    structuredData, 
    onSave,
    updateDataDirectly 
  });

  // Function to save and stay in edit mode
  const handleSaveOnly = () => {
    handleSave(true); // Save but stay in edit mode
  };

  // Function to submit and exit edit mode
  const handleSubmit = () => {
    handleSave(false); // Save and exit edit mode
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
        onSave={handleSaveOnly}
      />
      
      <PrescriberInfoCard
        prescriberInfo={prescriberInfo}
        onChange={handlePrescriberInfoChange}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch 
            id="stay-in-edit-mode" 
            checked={stayInEditMode} 
            onCheckedChange={toggleStayInEditMode} 
          />
          <Label htmlFor="stay-in-edit-mode">Stay in edit mode after saving</Label>
        </div>
        <Button onClick={handleSubmit} className="bg-[#33C3F0] hover:bg-[#33C3F0]/90">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionEditor;
