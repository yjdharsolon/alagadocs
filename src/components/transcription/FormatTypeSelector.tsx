
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FormatType {
  id: string;
  name: string;
}

interface FormatTypeSelectorProps {
  formatType: string;
  onFormatTypeChange: (value: string) => void;
  formatTypes: FormatType[];
}

const FormatTypeSelector: React.FC<FormatTypeSelectorProps> = ({
  formatType,
  onFormatTypeChange,
  formatTypes
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-md font-medium">Format Type</Label>
      <Select
        value={formatType}
        onValueChange={onFormatTypeChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select format type" />
        </SelectTrigger>
        <SelectContent>
          {formatTypes.map(type => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormatTypeSelector;
