
import { useState, useEffect } from 'react';
import { MedicalSections } from '../../types';
import { useProfileFields } from '@/hooks/useProfileFields';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Medication {
  id?: number;
  genericName: string;
  brandName: string; // Optional but included as a field
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
  
  // Improved initialization of medications with error handling and backward compatibility
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      if (!structuredData.medications) {
        return [];
      }
      
      if (Array.isArray(structuredData.medications)) {
        return structuredData.medications.map((med, index) => {
          // Handle backward compatibility where medication might have 'name' instead of 'genericName'
          const genericName = med.genericName || med.name || '';
          // Ensure all fields have at least empty string values to prevent null/undefined errors
          return {
            id: med.id || index + 1,
            genericName: genericName,
            brandName: med.brandName || '',
            strength: med.strength || '',
            dosageForm: med.dosageForm || '',
            sigInstructions: med.sigInstructions || '',
            quantity: med.quantity || '',
            refills: med.refills || '',
            specialInstructions: med.specialInstructions || ''
          };
        });
      } else if (typeof structuredData.medications === 'string') {
        // Handle case where medications might be a string
        console.warn('Medications provided as string instead of array:', structuredData.medications);
        return [];
      }
    } catch (error) {
      console.error('Error initializing medications:', error);
    }
    
    return [];
  });
  
  // Initialize prescriberInfo with correct structure
  const [prescriberInfo, setPrescriberInfo] = useState({
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
  
  // Handle medication changes with improved error handling
  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    try {
      if (index < 0 || index >= medications.length) {
        console.error(`Invalid medication index: ${index}`);
        return;
      }
      
      const updatedMedications = [...medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value
      };
      setMedications(updatedMedications);
    } catch (error) {
      console.error(`Error updating medication field '${field}':`, error);
      toast.error("Error updating medication information");
    }
  };
  
  // Add a new medication at the top of the list instead of the bottom
  const handleAddMedication = () => {
    try {
      // Create new medication with next ID
      const newMedication = {
        id: medications.length > 0 ? Math.max(...medications.map(med => med.id || 0)) + 1 : 1,
        genericName: '',
        brandName: '',
        strength: '',
        dosageForm: '',
        sigInstructions: '',
        quantity: '',
        refills: '',
        specialInstructions: ''
      };
      
      // Add new medication at the beginning of the array
      setMedications([newMedication, ...medications]);
    } catch (error) {
      console.error('Error adding new medication:', error);
      toast.error("Failed to add new medication");
    }
  };
  
  // Remove a medication with improved error handling
  const handleRemoveMedication = (index: number) => {
    try {
      if (index < 0 || index >= medications.length) {
        console.error(`Invalid medication index for removal: ${index}`);
        return;
      }
      
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      
      // Update IDs to maintain sequential numbering
      const reindexedMedications = updatedMedications.map((med, idx) => ({
        ...med,
        id: idx + 1
      }));
      
      setMedications(reindexedMedications);
    } catch (error) {
      console.error('Error removing medication:', error);
      toast.error("Failed to remove medication");
    }
  };
  
  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission with validation - FIXED: Changed property name from prescriberInfo to prescriberInformation
  const handleSave = () => {
    try {
      // Validate required fields
      const missingFields = medications.some(med => !med.genericName);
      if (missingFields) {
        toast.warning("Some medications are missing required generic name");
      }
      
      // Prepare updated data with properly structured medications
      const updatedData: MedicalSections = {
        ...structuredData,
        patientInformation: patientInfo,
        medications: medications.map(med => ({
          ...med,
          // Ensure both name and genericName are set for backward compatibility
          name: med.genericName, // Set name field to match genericName for backward compatibility
        })),
        prescriberInformation: prescriberInfo // Changed from prescriberInfo to prescriberInformation
      };
      
      console.log("Saving prescription with medications:", updatedData.medications);
      onSave(updatedData);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error("Failed to save prescription");
    }
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
