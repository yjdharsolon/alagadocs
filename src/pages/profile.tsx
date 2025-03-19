
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useProfileFields, ProfileData } from '@/hooks/useProfileFields';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useProfileFields();
  const [formData, setFormData] = useState<ProfileData>({});
  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form data when profile data is loaded
  React.useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
          </TabsList>

          <Card>
            <form onSubmit={handleSubmit}>
              <TabsContent value="personal" className="space-y-4">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middle_name">Middle Name</Label>
                      <Input 
                        id="middle_name" 
                        name="middle_name"
                        value={formData.middle_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_extension">Name Extension</Label>
                      <Input 
                        id="name_extension" 
                        name="name_extension"
                        placeholder="Jr., Sr., III, etc."
                        value={formData.name_extension || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medical_title">Medical Title</Label>
                    <Input 
                      id="medical_title" 
                      name="medical_title"
                      placeholder="MD, DMD, FPCP, etc."
                      value={formData.medical_title || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input 
                      id="profession" 
                      name="profession"
                      placeholder="Cardiologist, General Practitioner, etc."
                      value={formData.profession || ''}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <CardHeader>
                  <CardTitle>Professional Credentials</CardTitle>
                  <CardDescription>
                    Update your professional license information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prc_license">PRC License Number</Label>
                    <Input 
                      id="prc_license" 
                      name="prc_license"
                      value={formData.prc_license || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ptr_number">PTR Number</Label>
                    <Input 
                      id="ptr_number" 
                      name="ptr_number"
                      value={formData.ptr_number || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s2_number">S2 Number</Label>
                    <Input 
                      id="s2_number" 
                      name="s2_number"
                      value={formData.s2_number || ''}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="clinic" className="space-y-4">
                <CardHeader>
                  <CardTitle>Clinic Information</CardTitle>
                  <CardDescription>
                    Update your clinic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinic_name">Clinic Name</Label>
                    <Input 
                      id="clinic_name" 
                      name="clinic_name"
                      value={formData.clinic_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic_address">Clinic Address</Label>
                    <Input 
                      id="clinic_address" 
                      name="clinic_address"
                      value={formData.clinic_address || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic_schedule">Clinic Schedule/Hours</Label>
                    <Input 
                      id="clinic_schedule" 
                      name="clinic_schedule"
                      placeholder="Mon-Fri: 9AM-5PM, etc."
                      value={formData.clinic_schedule || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input 
                      id="contact_number" 
                      name="contact_number"
                      value={formData.contact_number || ''}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
}
