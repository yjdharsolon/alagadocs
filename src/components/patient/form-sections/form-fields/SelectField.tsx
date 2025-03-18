
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  includeNone?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  includeNone = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <Select
        value={value}
        onValueChange={(selectedValue) => onChange(selectedValue)}
      >
        <SelectTrigger 
          className="border-[#E0E0E0] focus:ring-[#33C3F0]/20 focus:border-[#33C3F0] transition-colors duration-200" 
          id={id}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-[#E0E0E0] shadow-md z-50 bg-white">
          {includeNone && <SelectItem value="_none">None</SelectItem>}
          {options.map(option => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
