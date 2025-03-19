
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/hooks/useProfileFields';

interface ClinicTabProps {
  formData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClinicTab: React.FC<ClinicTabProps> = ({ formData, handleChange }) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Clinic Information</CardTitle>
        <CardDescription>
          Update your clinic details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clinic_name">Clinic Name</Label>
          <Input 
            id="clinic_name" 
            name="clinic_name"
            value={formData.clinic_name || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic_address">Clinic Address</Label>
          <Input 
            id="clinic_address" 
            name="clinic_address"
            value={formData.clinic_address || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic_schedule">Clinic Schedule/Hours</Label>
          <Input 
            id="clinic_schedule" 
            name="clinic_schedule"
            placeholder="Mon-Fri: 9AM-5PM, etc."
            value={formData.clinic_schedule || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input 
            id="contact_number" 
            name="contact_number"
            value={formData.contact_number || ''}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </>
  );
}

export default ClinicTab;
