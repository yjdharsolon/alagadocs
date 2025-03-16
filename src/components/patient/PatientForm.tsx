
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from './form-sections/PersonalInfoForm';
import { EmergencyContactForm } from './form-sections/EmergencyContactForm';
import { MedicalInfoForm } from './form-sections/MedicalInfoForm';
import { TabSelector } from './form-sections/TabSelector';
import { usePatientForm } from '@/hooks/usePatientForm';
import { PatientFormContent } from './form-sections/PatientFormContent';

export type PatientFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  patientId: string;
  // New personal information fields
  age: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  bloodType: string;
  // Emergency contact information
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  // Medical information
  allergies: string;
  medicalConditions: string;
};

interface PatientFormProps {
  onCancel: () => void;
  patientData?: any; // For future edit functionality
  isEditing?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onCancel, 
  patientData,
  isEditing = false 
}) => {
  const {
    formData,
    activeTab,
    isSubmitting,
    calculatedAge,
    setActiveTab,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isEditing: editing
  } = usePatientForm({ patientData, isEditing, onCancel });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{editing ? 'Edit Patient Information' : 'Patient Information'}</CardTitle>
        <CardDescription>
          {editing 
            ? 'Update the patient\'s details' 
            : 'Enter the patient\'s details to register them in the system'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        <TabSelector
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <CardContent className="pt-6">
          <PatientFormContent
            activeTab={activeTab}
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            calculatedAge={calculatedAge}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              (editing ? 'Updating...' : 'Registering...') : 
              (editing ? 'Update Patient' : 'Register Patient')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
