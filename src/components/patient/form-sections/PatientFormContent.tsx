
import React from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { EmergencyContactForm } from './EmergencyContactForm';
import { MedicalInfoForm } from './MedicalInfoForm';
import { PatientFormData } from '../PatientForm';

interface PatientFormContentProps {
  activeTab: string;
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  calculatedAge: number | null;
}

export const PatientFormContent: React.FC<PatientFormContentProps> = ({
  activeTab,
  formData,
  handleChange,
  handleSelectChange,
  calculatedAge
}) => {
  if (activeTab === "personal") {
    return (
      <PersonalInfoForm
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        calculatedAge={calculatedAge}
      />
    );
  }
  
  if (activeTab === "emergency") {
    return (
      <EmergencyContactForm
        formData={formData}
        handleChange={handleChange}
      />
    );
  }
  
  if (activeTab === "medical") {
    return (
      <MedicalInfoForm
        formData={formData}
        handleChange={handleChange}
      />
    );
  }
  
  return null;
};
