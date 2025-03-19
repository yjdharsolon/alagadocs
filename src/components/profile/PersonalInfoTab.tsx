
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/hooks/useProfileFields';

interface PersonalInfoTabProps {
  formData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ formData, handleChange }) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input 
              id="first_name" 
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input 
              id="middle_name" 
              name="middle_name"
              value={formData.middle_name || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input 
              id="last_name" 
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_extension">Name Extension</Label>
            <Input 
              id="name_extension" 
              name="name_extension"
              placeholder="Jr., Sr., III, etc."
              value={formData.name_extension || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medical_title">Medical Title</Label>
          <Input 
            id="medical_title" 
            name="medical_title"
            placeholder="MD, DMD, FPCP, etc."
            value={formData.medical_title || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input 
            id="profession" 
            name="profession"
            placeholder="Cardiologist, General Practitioner, etc."
            value={formData.profession || ''}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </>
  );
}

export default PersonalInfoTab;
