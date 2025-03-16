
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PatientFormData } from '../PatientForm';

interface MedicalInfoFormProps {
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MedicalInfoForm: React.FC<MedicalInfoFormProps> = ({
  formData,
  handleChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea 
          id="allergies" 
          name="allergies" 
          placeholder="List any allergies the patient has..."
          value={formData.allergies}
          onChange={handleChange}
          className="min-h-24"
          autoComplete="off"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicalConditions">Medical Conditions</Label>
        <Textarea 
          id="medicalConditions" 
          name="medicalConditions" 
          placeholder="List any pre-existing medical conditions..."
          value={formData.medicalConditions}
          onChange={handleChange}
          className="min-h-24"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
