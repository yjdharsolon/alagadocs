
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';

type PatientFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  patientId: string;
  // New personal information fields
  age: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  bloodType: string;
  // Emergency contact information
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  // Medical information
  allergies: string;
  medicalConditions: string;
};

interface PatientFormProps {
  onCancel: () => void;
  patientData?: any; // For future edit functionality
  isEditing?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onCancel, 
  patientData,
  isEditing = false 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Form state
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: patientData?.first_name || '',
    lastName: patientData?.last_name || '',
    dateOfBirth: patientData?.date_of_birth || '',
    email: patientData?.email || '',
    phone: patientData?.phone || '',
    patientId: patientData?.patient_id || '',
    // New fields with default values
    age: patientData?.age?.toString() || '',
    gender: patientData?.gender || '',
    civilStatus: patientData?.civil_status || '',
    nationality: patientData?.nationality || '',
    bloodType: patientData?.blood_type || '',
    emergencyContactName: patientData?.emergency_contact_name || '',
    emergencyContactRelationship: patientData?.emergency_contact_relationship || '',
    emergencyContactPhone: patientData?.emergency_contact_phone || '',
    allergies: patientData?.allergies || '',
    medicalConditions: patientData?.medical_conditions || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      toast.error("First name and last name are required");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to register a patient");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const patientDataToSave = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth || null,
        email: formData.email || null,
        phone: formData.phone || null,
        patient_id: formData.patientId || null,
        user_id: user.id,
        // New fields
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        civil_status: formData.civilStatus || null,
        nationality: formData.nationality || null,
        blood_type: formData.bloodType || null,
        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_relationship: formData.emergencyContactRelationship || null,
        emergency_contact_phone: formData.emergencyContactPhone || null,
        allergies: formData.allergies || null,
        medical_conditions: formData.medicalConditions || null,
      };
      
      let response;
      
      if (isEditing && patientData?.id) {
        // Update existing patient
        response = await supabase
          .from('patients')
          .update(patientDataToSave)
          .eq('id', patientData.id)
          .select();
      } else {
        // Insert new patient
        response = await supabase
          .from('patients')
          .insert(patientDataToSave)
          .select();
      }
      
      if (response.error) {
        throw response.error;
      }
      
      const actionText = isEditing ? 'updated' : 'registered';
      toast.success(`Patient ${formData.firstName} ${formData.lastName} ${actionText} successfully!`);
      
      // Navigate based on action
      setTimeout(() => {
        if (isEditing) {
          navigate(`/patient-details?id=${patientData.id}`);
        } else {
          navigate('/upload');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'register'} patient. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const civilStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Patient Information' : 'Patient Information'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the patient\'s details' 
            : 'Enter the patient\'s details to register them in the system'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical Information</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="personal" className="space-y-4 mt-0">
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number"
                    placeholder="35"
                    value={formData.age}
                    onChange={handleChange}
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
                />
              </div>
            </TabsContent>
            
            <TabsContent value="emergency" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input 
                  id="emergencyContactName" 
                  name="emergencyContactName" 
                  placeholder="Jane Doe"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship to Patient</Label>
                  <Input 
                    id="emergencyContactRelationship" 
                    name="emergencyContactRelationship" 
                    placeholder="Spouse, Parent, etc."
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input 
                    id="emergencyContactPhone" 
                    name="emergencyContactPhone" 
                    placeholder="+1 (555) 987-6543"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  name="allergies" 
                  placeholder="List any allergies the patient has..."
                  value={formData.allergies}
                  onChange={handleChange}
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea 
                  id="medicalConditions" 
                  name="medicalConditions" 
                  placeholder="List any pre-existing medical conditions..."
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  className="min-h-24"
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              (isEditing ? 'Updating...' : 'Registering...') : 
              (isEditing ? 'Update Patient' : 'Register Patient')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
