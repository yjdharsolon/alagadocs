
import React from 'react';
import { PatientFormData } from '../PatientForm';
import { BasicInfoFields } from './personal-info/BasicInfoFields';
import { DateGenderFields } from './personal-info/DateGenderFields';
import { AdditionalInfoFields } from './personal-info/AdditionalInfoFields';
import { ContactInfoFields } from './personal-info/ContactInfoFields';

interface PersonalInfoFormProps {
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  calculatedAge: number | null;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  calculatedAge
}) => {
  return (
    <div className="space-y-4">
      <BasicInfoFields 
        firstName={formData.firstName}
        middleName={formData.middleName}
        lastName={formData.lastName}
        nameExtension={formData.nameExtension}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <DateGenderFields 
        dateOfBirth={formData.dateOfBirth}
        calculatedAge={calculatedAge}
        gender={formData.gender}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <AdditionalInfoFields 
        civilStatus={formData.civilStatus}
        nationality={formData.nationality}
        bloodType={formData.bloodType}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <ContactInfoFields 
        email={formData.email}
        phone={formData.phone}
        patientId={formData.patientId}
        handleChange={handleChange}
      />
    </div>
  );
};
