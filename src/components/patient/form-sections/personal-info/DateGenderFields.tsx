
import React from 'react';
import { FormField } from '../form-fields/FormField';
import { SelectField } from '../form-fields/SelectField';

interface DateGenderFieldsProps {
  dateOfBirth: string;
  calculatedAge: number | null;
  gender: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const DateGenderFields: React.FC<DateGenderFieldsProps> = ({
  dateOfBirth,
  calculatedAge,
  gender,
  handleChange,
  handleSelectChange,
}) => {
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        id="dateOfBirth"
        label="Date of Birth"
        value={dateOfBirth}
        onChange={handleChange}
        type="date"
      />
      
      <FormField
        id="age"
        label="Age (Calculated)"
        value={calculatedAge !== null ? calculatedAge.toString() : ''}
        readOnly
      />
      
      <SelectField
        id="gender"
        label="Gender"
        value={gender}
        onChange={(value) => handleSelectChange('gender', value)}
        options={genderOptions}
        placeholder="Select gender"
      />
    </div>
  );
};
