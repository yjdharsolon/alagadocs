
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PatientFormData } from '../PatientForm';

interface PersonalInfoFormProps {
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  calculatedAge: number | null;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  calculatedAge
}) => {
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const civilStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  const nameExtensionOptions = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input 
            id="middleName" 
            name="middleName" 
            placeholder="David"
            value={formData.middleName}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nameExtension">Name Extension</Label>
          <Select
            value={formData.nameExtension}
            onValueChange={(value) => handleSelectChange('nameExtension', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select extension" />
            </SelectTrigger>
            <SelectContent>
              {/* Fix: Use a non-empty string for the "None" option */}
              <SelectItem value="_none">None</SelectItem>
              {nameExtensionOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input 
            id="dateOfBirth" 
            name="dateOfBirth" 
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age (Calculated)</Label>
          <Input 
            id="age" 
            name="age"
            value={calculatedAge !== null ? calculatedAge.toString() : ''}
            readOnly
            className="bg-gray-100"
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="civilStatus">Civil Status</Label>
          <Select
            value={formData.civilStatus}
            onValueChange={(value) => handleSelectChange('civilStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {civilStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input 
            id="nationality" 
            name="nationality" 
            placeholder="Filipino"
            value={formData.nationality}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select
            value={formData.bloodType}
            onValueChange={(value) => handleSelectChange('bloodType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypeOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="patientId">Patient ID (Optional)</Label>
        <Input 
          id="patientId" 
          name="patientId" 
          placeholder="e.g., PAT-12345"
          value={formData.patientId}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
