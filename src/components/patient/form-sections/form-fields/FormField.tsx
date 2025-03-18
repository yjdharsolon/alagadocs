
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  type?: string;
  className?: string;
  autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  placeholder = '',
  value,
  onChange,
  required = false,
  readOnly = false,
  type = 'text',
  className = '',
  autoComplete = 'off'
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}{required && <span className="text-red-500">*</span>}</Label>
      <Input 
        id={id} 
        name={id} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        readOnly={readOnly}
        className={`${readOnly ? 'bg-gray-100' : ''} border-[#E0E0E0] focus:border-[#33C3F0] focus:ring-[#33C3F0]/20 transition-colors duration-200 ${className}`}
        autoComplete={autoComplete}
      />
    </div>
  );
};
