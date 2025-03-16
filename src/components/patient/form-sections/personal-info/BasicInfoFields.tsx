
import React from 'react';
import { FormField } from '../form-fields/FormField';
import { SelectField } from '../form-fields/SelectField';

interface BasicInfoFieldsProps {
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  firstName,
  middleName,
  lastName,
  nameExtension,
  handleChange,
  handleSelectChange,
}) => {
  const nameExtensionOptions = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="John"
          value={firstName}
          onChange={handleChange}
          required
        />
        
        <FormField
          id="middleName"
          label="Middle Name"
          placeholder="David"
          value={middleName}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          value={lastName}
          onChange={handleChange}
          required
        />
        
        <SelectField
          id="nameExtension"
          label="Name Extension"
          value={nameExtension}
          onChange={(value) => handleSelectChange('nameExtension', value)}
          options={nameExtensionOptions}
          placeholder="Select extension"
          includeNone
        />
      </div>
    </>
  );
};
