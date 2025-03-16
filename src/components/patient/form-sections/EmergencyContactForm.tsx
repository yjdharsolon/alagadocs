
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientFormData } from '../PatientForm';

interface EmergencyContactFormProps {
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  formData,
  handleChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
        <Input 
          id="emergencyContactName" 
          name="emergencyContactName" 
          placeholder="Jane Doe"
          value={formData.emergencyContactName}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactRelationship">Relationship to Patient</Label>
          <Input 
            id="emergencyContactRelationship" 
            name="emergencyContactRelationship" 
            placeholder="Spouse, Parent, etc."
            value={formData.emergencyContactRelationship}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
          <Input 
            id="emergencyContactPhone" 
            name="emergencyContactPhone" 
            placeholder="+1 (555) 987-6543"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};
