
import React from 'react';
import { FormField } from '../form-fields/FormField';
import { SelectField } from '../form-fields/SelectField';

interface AdditionalInfoFieldsProps {
  civilStatus: string;
  nationality: string;
  bloodType: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const AdditionalInfoFields: React.FC<AdditionalInfoFieldsProps> = ({
  civilStatus,
  nationality,
  bloodType,
  handleChange,
  handleSelectChange,
}) => {
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const civilStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SelectField
        id="civilStatus"
        label="Civil Status"
        value={civilStatus}
        onChange={(value) => handleSelectChange('civilStatus', value)}
        options={civilStatusOptions}
        placeholder="Select status"
      />
      
      <FormField
        id="nationality"
        label="Nationality"
        placeholder="Filipino"
        value={nationality}
        onChange={handleChange}
      />
      
      <SelectField
        id="bloodType"
        label="Blood Type"
        value={bloodType}
        onChange={(value) => handleSelectChange('bloodType', value)}
        options={bloodTypeOptions}
        placeholder="Select blood type"
      />
    </div>
  );
};
