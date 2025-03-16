import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { differenceInYears } from 'date-fns';
import { PatientFormData } from '@/components/patient/PatientForm';

interface UsePatientFormProps {
  patientData?: any;
  isEditing?: boolean;
  onCancel: () => void;
}

export const usePatientForm = ({
  patientData,
  isEditing = false,
  onCancel
}: UsePatientFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: patientData?.first_name || '',
    middleName: patientData?.middle_name || '',
    lastName: patientData?.last_name || '',
    nameExtension: patientData?.name_extension || '',
    dateOfBirth: patientData?.date_of_birth || '',
    email: patientData?.email || '',
    phone: patientData?.phone || '',
    patientId: patientData?.patient_id || '',
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
        response = await supabase
          .from('patients')
          .update(patientDataToSave)
          .eq('id', patientData.id)
          .select();
      } else {
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
      
      if (isEditing) {
        navigate(`/patient-details?id=${patientData.id}`);
      } else {
        navigate('/upload');
      }
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'register'} patient. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    activeTab,
    isSubmitting,
    calculatedAge,
    setActiveTab,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isEditing,
    onCancel
  };
};
