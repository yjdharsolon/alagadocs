
import { MedicalSections } from '../../types';

export interface Medication {
  id?: number;
  genericName: string;
  brandName: string; 
  strength: string;
  dosageForm: string;
  sigInstructions: string;
  quantity: string;
  refills: string;
  specialInstructions: string;
}

export interface PatientInfo {
  name: string;
  sex: string;
  age: string;
  date: string;
}

export interface PrescriberInfo {
  name: string;
  licenseNumber: string;
  s2Number: string;
  ptrNumber: string;
}

export interface UsePrescriptionEditorProps {
  structuredData: MedicalSections;
  onSave: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
}

export interface PrescriptionEditorState {
  patientInfo: PatientInfo;
  medications: Medication[];
  prescriberInfo: PrescriberInfo;
  stayInEditMode: boolean;
  handlePatientInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMedicationChange: (index: number, field: keyof Medication, value: string) => void;
  handleAddMedication: () => void;
  handleRemoveMedication: (index: number) => void;
  handlePrescriberInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleStayInEditMode: () => void;
  handleSave: (forceStayInEditMode?: boolean) => void;
}
