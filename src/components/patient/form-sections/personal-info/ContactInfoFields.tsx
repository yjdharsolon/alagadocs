
import React from 'react';
import { FormField } from '../form-fields/FormField';

interface ContactInfoFieldsProps {
  email: string;
  phone: string;
  patientId: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({
  email,
  phone,
  patientId,
  handleChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="email"
          label="Email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={handleChange}
          type="email"
        />
        
        <FormField
          id="phone"
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={handleChange}
        />
      </div>
      
      <FormField
        id="patientId"
        label="Patient ID (Optional)"
        placeholder="e.g., PAT-12345"
        value={patientId}
        onChange={handleChange}
      />
    </>
  );
};
