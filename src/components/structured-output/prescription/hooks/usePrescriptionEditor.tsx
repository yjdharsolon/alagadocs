
import { MedicalSections } from '../../types';
import { useAuth } from '@/hooks/useAuth';
import { 
  PrescriptionEditorState, 
  UsePrescriptionEditorProps
} from '../types/prescriptionTypes';

import { usePatientInfoState } from './usePatientInfoState';
import { usePrescriberInfoState } from './usePrescriberInfoState';
import { useMedicationState } from './useMedicationState';
import { useSaveHandler } from './useSaveHandler';

/**
 * Primary hook for managing the prescription editor state and operations
 */
export const usePrescriptionEditor = ({
  structuredData,
  onSave,
  updateDataDirectly
}: UsePrescriptionEditorProps): PrescriptionEditorState => {
  const { user } = useAuth();
  
  console.log('[usePrescriptionEditor] Initializing with structuredData:', 
    JSON.stringify({
      hasMedications: !!structuredData.medications,
      medicationCount: structuredData.medications ? 
        (Array.isArray(structuredData.medications) ? structuredData.medications.length : 'not array') : 
        'none'
    }));

  // Use the separated hooks for managing different aspects of the editor
  const { patientInfo, handlePatientInfoChange } = usePatientInfoState(structuredData);
  const { prescriberInfo, handlePrescriberInfoChange } = usePrescriberInfoState(structuredData);
  const { 
    medications, 
    handleMedicationChangeState: handleMedicationChange, 
    handleAddMedication, 
    handleRemoveMedication 
  } = useMedicationState(structuredData);
  const { stayInEditMode, toggleStayInEditMode, handleSave } = useSaveHandler(
    structuredData,
    patientInfo,
    medications,
    prescriberInfo,
    onSave,
    updateDataDirectly
  );

  return {
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
  };
};

export type { Medication } from '../types/prescriptionTypes';
