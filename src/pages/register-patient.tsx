
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
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
import toast from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';

export default function RegisterPatientPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    patientId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      // Insert patient data into Supabase
      const { data, error } = await supabase
        .from('patients')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth || null,
          email: formData.email || null,
          phone: formData.phone || null,
          patient_id: formData.patientId || null,
          user_id: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Patient ${formData.firstName} ${formData.lastName} registered successfully!`);
      
      // Navigate to upload page to start consultation
      setTimeout(() => {
        navigate('/upload');
      }, 1500);
    } catch (error: any) {
      console.error('Error registering patient:', error);
      toast.error(error.message || 'Failed to register patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/select-patient');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Register New Patient</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Enter the patient's details to register them in the system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register Patient'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
