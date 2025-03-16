
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { differenceInYears } from 'date-fns';
import { PersonalInfoForm } from './form-sections/PersonalInfoForm';
import { EmergencyContactForm } from './form-sections/EmergencyContactForm';
import { MedicalInfoForm } from './form-sections/MedicalInfoForm';
import { TabSelector } from './form-sections/TabSelector';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: patientData?.first_name || '',
    middleName: patientData?.middle_name || '',
    lastName: patientData?.last_name || '',
    nameExtension: patientData?.name_extension || '',
    dateOfBirth: patientData?.date_of_birth || '',
    email: patientData?.email || '',
    phone: patientData?.phone || '',
    patientId: patientData?.patient_id || '',
    // New fields with default values
    age: patientData?.age?.toString() || '',
    gender: patientData?.gender || '',
    civilStatus: patientData?.civil_status || '',
    nationality: patientData?.nationality || '',
    bloodType: patientData?.blood_type || '',
    emergencyContactName: patientData?.emergency_contact_name || '',
    emergencyContactRelationship: patientData?.emergency_contact_relationship || '',
    emergencyContactPhone: patientData?.emergency_contact_phone || '',
    allergies: patientData?.allergies || '',
    medicalConditions: patientData?.medical_conditions || '',
  });

  // Calculate age when date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = differenceInYears(today, birthDate);
      
      if (!isNaN(age) && age >= 0) {
        setCalculatedAge(age);
      } else {
        setCalculatedAge(null);
      }
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateOfBirth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      toast.error("First name and last name are required");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to register a patient");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const patientDataToSave = {
        first_name: formData.firstName,
        middle_name: formData.middleName || null,
        last_name: formData.lastName,
        name_extension: formData.nameExtension || null,
        date_of_birth: formData.dateOfBirth || null,
        email: formData.email || null,
        phone: formData.phone || null,
        patient_id: formData.patientId || null,
        user_id: user.id,
        // Use calculated age instead of form input
        age: calculatedAge,
        gender: formData.gender || null,
        civil_status: formData.civilStatus || null,
        nationality: formData.nationality || null,
        blood_type: formData.bloodType || null,
        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_relationship: formData.emergencyContactRelationship || null,
        emergency_contact_phone: formData.emergencyContactPhone || null,
        allergies: formData.allergies || null,
        medical_conditions: formData.medicalConditions || null,
      };
      
      let response;
      
      if (isEditing && patientData?.id) {
        // Update existing patient
        response = await supabase
          .from('patients')
          .update(patientDataToSave)
          .eq('id', patientData.id)
          .select();
      } else {
        // Insert new patient
        response = await supabase
          .from('patients')
          .insert(patientDataToSave)
          .select();
      }
      
      if (response.error) {
        throw response.error;
      }
      
      const actionText = isEditing ? 'updated' : 'registered';
      toast.success(`Patient ${formData.firstName} ${formData.lastName} ${actionText} successfully!`);
      
      // Navigate based on action
      setTimeout(() => {
        if (isEditing) {
          navigate(`/patient-details?id=${patientData.id}`);
        } else {
          navigate('/upload');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'register'} patient. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Patient Information' : 'Patient Information'}</CardTitle>
        <CardDescription>
          {isEditing 
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
          {activeTab === "personal" && (
            <PersonalInfoForm
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              calculatedAge={calculatedAge}
            />
          )}
          
          {activeTab === "emergency" && (
            <EmergencyContactForm
              formData={formData}
              handleChange={handleChange}
            />
          )}
          
          {activeTab === "medical" && (
            <MedicalInfoForm
              formData={formData}
              handleChange={handleChange}
            />
          )}
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
              (isEditing ? 'Updating...' : 'Registering...') : 
              (isEditing ? 'Update Patient' : 'Register Patient')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
