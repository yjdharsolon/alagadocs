
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/hooks/useProfileFields';

interface ProfessionalTabProps {
  formData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfessionalTab: React.FC<ProfessionalTabProps> = ({ formData, handleChange }) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Professional Credentials</CardTitle>
        <CardDescription>
          Update your professional license information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prc_license">PRC License Number</Label>
          <Input 
            id="prc_license" 
            name="prc_license"
            value={formData.prc_license || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ptr_number">PTR Number</Label>
          <Input 
            id="ptr_number" 
            name="ptr_number"
            value={formData.ptr_number || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s2_number">S2 Number</Label>
          <Input 
            id="s2_number" 
            name="s2_number"
            value={formData.s2_number || ''}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </>
  );
}

export default ProfessionalTab;
