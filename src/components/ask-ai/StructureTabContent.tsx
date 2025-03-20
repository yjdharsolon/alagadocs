
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TemplateSelector from './TemplateSelector';

interface StructureTabContentProps {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
}

const StructureTabContent: React.FC<StructureTabContentProps> = ({ 
  role, 
  setRole, 
  selectedTemplate, 
  setSelectedTemplate 
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Structure Medical Text</h2>
      <p className="text-muted-foreground mb-6">
        Convert raw medical text into a structured clinical note format.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select your role
          </label>
          <Select
            value={role}
            onValueChange={setRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Medical Assistant">Medical Assistant</SelectItem>
              <SelectItem value="Pharmacist">Pharmacist</SelectItem>
              <SelectItem value="Medical Student">Medical Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      </div>
    </>
  );
};

export default StructureTabContent;
